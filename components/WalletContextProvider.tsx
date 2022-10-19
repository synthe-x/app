import * as React from 'react'
import axios from 'axios';

const WalletContext = React.createContext<WalletValue>({} as WalletValue);
const collateralsConfig = require('../artifacts/collaterals.json');
const synthsConfig = require('../artifacts/synths.json');
const tradingPoolsConfig = require('../artifacts/tradingPools.json');

interface WalletValue {
    address: null|string;
    tronWeb: {};
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    chain: null;
    connect: () => void;
    isDataReady: boolean;
    collaterals: any[];
    totalCollateral: number;
	synths: any[], totalDebt: number, pools: any[], poolUserData: null[],
    fetchData: (_tronWeb?: any, _address?: null) => void;
	tradingPool: number; setTradingPool: (_:number) => void;
	connectionError: string;
	dollarFormatter: any, tokenFormatter: any
}

function WalletContextProvider({children}: any) {
    const [address, setAddress] = React.useState<null|string>(null);
    const [tronWeb, setTronWeb] = React.useState({});
    const [isConnected, setIsConnected] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [isDisconnected, setIsDisconnected] = React.useState(false);
	const [connectionError, setConnectionError] = React.useState('');
    const [chain, setChain] = React.useState(null);
    const [collaterals, setCollaterals] = React.useState([null]);
    const [totalCollateral, setTotalCollateral] = React.useState(-1);
    const [synths, setSynths] = React.useState([null]);
    const [totalDebt, setTotalDebt] = React.useState(-1);
    const [isDataReady, setIsDataReady] = React.useState(false);
	const [pools, setPools] = React.useState([null]);
	const [poolUserData, setPoolUserData] = React.useState([null]);
	const [tradingPool, setTradingPool] = React.useState(0);
	const [dollarFormatter, setDollarFormatter] = React.useState({});
	const [tokenFormatter, setTokenFormatter] = React.useState({});


	React.useEffect(() => {
		if(localStorage.getItem("address")){
			connect()
		}
		setDollarFormatter(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));
		setTokenFormatter(new Intl.NumberFormat('en-US'));
	}, []);

    const connect = () => {
        if((window as any).tronWeb){
            setTronWeb((window as any).tronWeb);
            setIsConnecting(true);
            (window as any).tronWeb.trx.getAccount((window as any).tronWeb.defaultAddress.base58).then((account: any) => {
                let _addr = '';
				if(!account.address){
					_addr = (window as any).tronWeb.address.fromHex(account.__payload__.address);
				} else {
					_addr = (window as any).tronWeb.address.fromHex(account.address);
				}
				setAddress(_addr)
                setIsConnected(true);
                setIsConnecting(false);
				if((window as any).tronWeb.fullNode.host != 'https://api.nileex.io'){
					setConnectionError('Please connect to Nile Testnet');
				} else {
					setChain((window as any).tronWeb.fullNode.host)
					fetchData((window as any).tronWeb, _addr)
					// fetchDataLocal((window as any).tronWeb, _addr)
				}
				localStorage.setItem("address", _addr)
            })
        }
    }

    const fetchData = (_tronWeb: any = tronWeb, _address = address) => {
		Promise.all([
			axios.get("http://127.0.0.1:3030/assets/synths"), 
			axios.get("http://127.0.0.1:3030/assets/collaterals"),
			axios.get("http://127.0.0.1:3030/pool/all")
		]).then(async (res)=>{
			let contract = await _tronWeb.contract().at("TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE");
			_setSynths(res[2].data.data, res[0].data.data, contract, _tronWeb, _address);
			_setCollaterals(res[1].data.data, contract, _tronWeb, _address)
		})
    }

	const fetchDataLocal = async (_tronWeb: any = tronWeb, _address = address) => {
		let contract = await _tronWeb.contract().at("TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE");
		_setSynths(tradingPoolsConfig, synthsConfig, contract, _tronWeb, _address);
		_setCollaterals(collateralsConfig, contract, _tronWeb, _address)
    }

	const _setCollaterals = (_collaterals: any, contract: any, _tronWeb = tronWeb, _address = address) => {
		let tokens = []
		console.log(_collaterals)
		for(let i in _collaterals){
			tokens.push(_collaterals[i].coll_address)
			tokens.push(_collaterals[i].cAsset)
		}
		
		contract.balanceOf(tokens, _address).call()
		.then((res: any) => {
			let collateralBalance = 0;
			for(let i = 0; i < res.length; i+=2){
				_collaterals[i/2]['walletBalance'] = (res[i]).toString();
				_collaterals[i/2]['amount'] = res[i+1].toString();
				collateralBalance+=(res[i+1].toString())*_collaterals[i/2].price/10**_collaterals[i/2].decimal;
			}
			setCollaterals(_collaterals);
			setTotalCollateral(collateralBalance);
		})
		.catch((err: any) => {
			console.log("Error:", err);
		})
	}

	const _setSynths = (_tradingPools: any, _synths: any, contract: any, _tronWeb = tronWeb, _address = address) => {
		let tokens: string[] = []
		// let tokenWeNeed = ["AUXX", "CLXX"]
		for(let i in _synths){
			tokens.push(_synths[i].synth_id)
			// if(tokenWeNeed.includes(_synths[i].symbol)){
			// 	tokens.push(_synths[i].synth_id)
			// }
		}


		// console.log(JSON.stringify(tokens));

		Promise.all([contract.balanceOf(tokens, _address).call(), contract.debtBalanceOf(tokens, _address).call()])
		.then((res: any) => {
			let walletBalances = res[0];
			let debtBalances = res[1];

			for(let i = 0; i < walletBalances.length; i++){
				_synths[i]['walletBalance'] = (walletBalances[i]).toString();
			}

			let borrowBalance = 0;
			for(let i = 0; i < debtBalances.length; i++){
				_synths[i]['amount'] = [(debtBalances[i]).toString()];
				borrowBalance += Number(debtBalances[i]/1e18)*_synths[i].price;
			}
			setTotalDebt(borrowBalance);
			

			let tradingPoolAddresses: string[] = []
			for(let i in _tradingPools){
				tradingPoolAddresses.push(_tradingPools[i].pool_address)
			}
			
			_tradingPools.splice(0, 0, {
				"pool_address": "0x0000000000000000000000000000000000000000",
				"name": "My Wallet",
				"symbol": "USER",
			});

			setPools(_tradingPools);
			
			let poolUserDataRequests:any = [];
			for(let i in tradingPoolAddresses){
				poolUserDataRequests.push(contract.tradingBalanceOf(tradingPoolAddresses[i], tokens, _address).call())
			}
			
			Promise.all(poolUserDataRequests)
			.then((res: any) => {
				for(let i in res){
					for(let j = 0; j < res[i].length; j++){
						_synths[j]['amount'].push((res[i][j]).toString());
					}
				}
				setSynths(_synths);
				setIsDataReady(true)
			})
			.catch((err: any) => {
				console.log("Error:", err);
			})
			})
			.catch((err: any) => {
				console.log("Error:", err);
			})
	}

    const value: WalletValue = {
        address, tronWeb, isConnected, isConnecting, isDisconnected, chain, 
        connect,
        isDataReady, collaterals, totalCollateral, synths, totalDebt, pools, poolUserData, tradingPool, setTradingPool,
        fetchData, connectionError,
		dollarFormatter, tokenFormatter
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export {WalletContextProvider, WalletContext}