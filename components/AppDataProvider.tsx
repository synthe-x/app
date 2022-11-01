import * as React from 'react';
import axios from 'axios';
import { ChainID } from '../src/chains';
import { getContract, getABI, getAddress, call } from '../src/utils';
import Web3 from 'web3';
import { data } from '../src/data';
const { Big } = require('big.js');

const AppDataContext = React.createContext<AppDataValue>({} as AppDataValue);
// const collateralsConfig = require('../artifacts/collaterals.json');
// const synthsConfig = require('../artifacts/synths.json');
// const tradingPoolsConfig = require('../artifacts/tradingPools.json');

const DUMMY_ADDRESS = 'TU6nPbkDzMfhtg13nUnTMbuVFFMpLSs3P3';

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const node = 'https://nile.trongrid.io';
const fullNode = new HttpProvider(node);
const solidityNode = new HttpProvider(node);
const eventServer = new HttpProvider(node);
const privateKey =
	'52641f54dc5e1951657523c8e7a1c44ac76229a4b14db076dce6a6ce9ae9293d';
const tronWebObject = new TronWeb(
	fullNode,
	solidityNode,
	eventServer,
	privateKey
);

// const query = require("../src/queries/query.gql");

function AppDataProvider({ children }: any) {
	const [isDataReady, setIsDataReady] = React.useState(false);
	const [isFetchingData, setIsFetchingData] = React.useState(false);
	const [dataFetchError, setDataFetchError] = React.useState<string | null>(
		null
	);

	const [collaterals, setCollaterals] = React.useState<any[]>([]);
	const [totalCollateral, setTotalCollateral] = React.useState(0);
	const [synths, setSynths] = React.useState<any[]>([]);
	const [totalDebt, setTotalDebt] = React.useState(0);

	const [pools, setPools] = React.useState([]);
	const [tradingPool, setTradingPool] = React.useState(0);
	const [dollarFormatter, setDollarFormatter] = React.useState<null | {}>(
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		})
	);
	const [tokenFormatter, setTokenFormatter] = React.useState<null | {}>(new Intl.NumberFormat('en-US'));
	const [minCRatio, setMinCRatio] = React.useState(130);
	const [safeCRatio, setSafeCRatio] = React.useState(200);

	const tradingBalanceOf = (_s: string) => {
		for (let i in synths) {
			if (synths[i].synth_id == _s) {
				return synths[i].amount[tradingPool];
			}
		}
	};

	const fetchData = (chain: ChainID, web3: any, _address: string) => {
		if(chain != ChainID.NILE){
			if(!web3.eth) web3 = new Web3((window as any).ethereum);
			console.log((window as any).web3.currentProvider);
			fetchSubgraph(chain, web3, _address)
		} else {
			fetchNileAPI(chain, web3, _address);
		}
	}

	const fetchNileAPI = (chain: ChainID, _tronWeb: any, _address: string) => {
        if(_tronWeb) _tronWeb = tronWebObject
        if(!_tronWeb.contract) return
		return new Promise((resolve, reject) => {
			setIsFetchingData(true);
			console.log('Fetching data...');
			Promise.all([
				axios.get(data[chain].synths), // synths
				axios.get(data[chain].collaterals), // collaterals
				axios.get(data[chain].pools), // pools
				axios.get(data[chain].system), // system
			])
				.then(async (res) => {
					let contract = await getContract(_tronWeb, getABI(chain, "Helper"), getAddress(chain, "Helper"), chain)
					Promise.all([_setSynths(
						chain,
						res[2].data.data,
						res[0].data.data,
						contract,
						_tronWeb,
						_address
					),
					_setCollaterals(
						chain,
						res[1].data.data,
						contract,
						_tronWeb,
						_address
					)]).then((_) => {
                        setMinCRatio(res[3].data.data.minCollateralRatio);
                        setSafeCRatio(res[3].data.data.safeCollateralRatio);
                        resolve(null)
                    })
                    .catch(err => {
                        reject(err)
                    })
				})
				.catch((err) => {
					setDataFetchError(
						'Failed to fetch data. Please refresh the page.'
					);
                    reject(err)
				});
		});
	};

	const fetchSubgraph = (chain: ChainID, web3: any, _address: string) => {
		console.log("web3", web3);
        // if(web3) web3 = tronWebObject
        // if(!web3.contract) return
		return new Promise((resolve, reject) => {
			setIsFetchingData(true);
			console.log('Fetching data...');
			axios.post(data[chain].subgraph, {query: data[chain].query}, {
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					let contract = await getContract(web3, getABI(chain, "Helper"), getAddress(chain, "Helper"), chain)
					Promise.all([_setSynths(
						chain,
						res.data.data.tradingPools,
						res.data.data.synths,
						contract,
						web3,
						_address
					),
					_setCollaterals(
						chain,
						res.data.data.collaterals,
						contract,
						web3,
						_address
					)
				]).then((_) => {
                    //     setMinCRatio(res[3].data.data.minCollateralRatio);
                    //     setSafeCRatio(res[3].data.data.safeCollateralRatio);
                    //     resolve(null)
                    })
                    .catch(err => {
                        reject(err)
                    })
				})
				.catch((err) => {
					setDataFetchError(
						'Failed to fetch data. Please refresh the page.'
					);
                    reject(err)
				});
		});
	};

	// const fetchDataLocal = async (_tronWeb: any, _address: string) => {
	// 	let contract = await _tronWeb
	// 		.contract()
	// 		.at('TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE');
	// 	_setSynths(
	// 		tradingPoolsConfig,
	// 		synthsConfig,
	// 		contract,
	// 		_tronWeb,
	// 		_address
	// 	);
	// 	_setCollaterals(collateralsConfig, contract, _tronWeb, _address);
	// };

	const _setCollaterals = (
		chain: ChainID,
		_collaterals: any,
		contract: any,
		_tronWeb: any,
		_address: string
	) => {
		return new Promise((resolve, reject) => {
			let tokens = [];
			for (let i in _collaterals) {
				tokens.push(_collaterals[i].coll_address);
				tokens.push(_collaterals[i].cAsset);
			}

			// contract
			// 	.balanceOf(tokens, _address)
			// 	.call()
			call(contract, 'balanceOf', [tokens, _address], chain)
				.then((res: any) => {
					console.log("collateral balance", res)
					// return
					// res = res[0];
					let collateralBalance = 0;
					for (let i = 0; i < res.length; i += 2) {
						_collaterals[i / 2]['walletBalance'] =
							res[i].toString();
						_collaterals[i / 2]['amount'] = res[i + 1].toString();
						collateralBalance +=
							(res[i + 1].toString() *
								_collaterals[i / 2].price) /
							10 ** _collaterals[i / 2].decimal;
					}
					setCollaterals(_collaterals);
					setTotalCollateral(collateralBalance);
                    resolve(null)
				})
				.catch((err: any) => {
					console.log('Error:', err);
                    reject(err)
				});
		});
	};

	const updateCollateralWalletBalance = (
		collateralAddress: string,
		value: string,
		isMinus: boolean = false
	) => {
		let _collaterals = collaterals;
		console.log(collaterals, collateralAddress, value);
		for (let i in _collaterals) {
			if (_collaterals[i].coll_address == collateralAddress) {
				_collaterals[i].walletBalance = (
					isMinus
						? Big(_collaterals[i].walletBalance).minus(Big(value))
						: Big(_collaterals[i].walletBalance).plus(value)
				).toString();
			}
		}
		setCollaterals(_collaterals);
	};

	const updateCollateralAmount = (
		collateralAddress: string,
		value: string,
		isMinus: boolean = false
	) => {
		let _collaterals = collaterals;
		for (let i in _collaterals) {
			if (_collaterals[i].coll_address == collateralAddress) {
				_collaterals[i].amount = (
					isMinus
						? Big(_collaterals[i].amount).minus(value)
						: Big(_collaterals[i].amount).plus(value)
				).toString();
				// update total collateral
				isMinus
					? setTotalCollateral(
							Big(totalCollateral)
								.minus(
									(Big(value) * _collaterals[i].price) /
										10 ** _collaterals[i].decimal
								)
								.toString()
					  )
					: setTotalCollateral(
							Big(totalCollateral)
								.plus(
									(Big(value) * _collaterals[i].price) /
										10 ** _collaterals[i].decimal
								)
								.toString()
					  );
			}
		}
		setCollaterals(_collaterals);
	};

	const _setSynths = (
		chain: ChainID,
		_tradingPools: any,
		_synths: any,
		contract: any,
		_tronWeb: string,
		_address: string
	) => {
		return new Promise((resolve, reject) => {
			let tokens: string[] = [];
			for (let i in _synths) {
				tokens.push(_synths[i].synth_id);
			}

			Promise.all([
				call(contract, 'balanceOf', [tokens, _address], chain),
				call(contract, 'debtBalanceOf', [tokens, _address], chain),
			])
				.then((res: any) => {
					console.log("synths balance", res);
					// return
					let walletBalances = res[0];
					let debtBalances = res[1];

					let totalDebt = 0;

					for (let i = 0; i < walletBalances.length; i++) {
						_synths[i]['walletBalance'] =
							walletBalances[i].toString();
					}

					console.log(_synths);

					for (let i = 0; i < debtBalances.length; i++) {
						_synths[i]['amount'] = [debtBalances[i].toString()];
						totalDebt +=
							Number(debtBalances[i] / 1e18) * _synths[i].price;
					}

					let tradingPoolAddresses: string[] = [];
					for (let i in _tradingPools) {
						tradingPoolAddresses.push(
							_tradingPools[i].pool_address ?? _tradingPools[i].id
						);
					}

					_tradingPools.splice(0, 0, {
						pool_address:
							'0x0000000000000000000000000000000000000000',
						name: 'My Wallet',
						symbol: 'USER',
					});

					setPools(_tradingPools);
					console.log(tradingPoolAddresses);

					let poolUserDataRequests: any = [];
					for (let i in tradingPoolAddresses) {
						poolUserDataRequests.push(
							call(contract, 'tradingBalanceOf', [tradingPoolAddresses[i], tokens, _address], chain)
							// contract
							// 	.tradingBalanceOf(
							// 		tradingPoolAddresses[i],
							// 		tokens,
							// 		_address
							// 	)
							// 	.call()
						);
					}

					Promise.all(poolUserDataRequests)
						.then((res: any) => {
							console.log("user pool data", res);
							for (let i in res) {
								for (let j = 0; j < res[i][0].length; j++) {
									if (!_synths[j].amount)
										_synths[j]['amount'] = [];
									_synths[j]['amount'].push(
										res[i][0][j].toString()
									);
									totalDebt +=
										Number(res[i][0][j] / 1e18) *
										_synths[j].price;
								}
							}
							console.log(totalDebt, _synths)
							setTotalDebt(totalDebt);
							setSynths(_synths);
							setIsDataReady(true);
							setIsFetchingData(false);
                            resolve(null)
						})
						.catch((err: any) => {
							console.log('Error:', err);
                            reject(err)
						});
				})
				.catch((err: any) => {
					console.log('Error:', err);
                    reject(err)
				});
		});
	};

	const updateSynthWalletBalance = (
		synthAddress: string,
		value: string,
		isMinus: boolean = false
	) => {
		let _synths = synths;
		for (let i in _synths) {
			if (_synths[i].synth_id == synthAddress) {
				_synths[i].walletBalance = (
					isMinus
						? Big(_synths[i].walletBalance).minus(value)
						: Big(_synths[i].walletBalance).plus(value)
				).toString();
			}
		}
		setSynths(_synths);
	};

	const updateSynthAmount = (
		synthAddress: string,
		poolId: number,
		value: string,
		isMinus: boolean = false
	) => {
		let _synths = synths;
		for (let i in _synths) {
			if (_synths[i].synth_id == synthAddress) {
				_synths[i].amount[poolId] = (
					isMinus
						? Big(_synths[i].amount[poolId]).minus(value)
						: Big(_synths[i].amount[poolId]).plus(value)
				).toString();
				// update total debt
				isMinus
					? setTotalDebt(
							Big(totalDebt)
								.minus(
									(Big(value) * _synths[i].price) /
										10 ** _synths[i].decimal
								)
								.toString()
					  )
					: setTotalDebt(
							Big(totalDebt)
								.plus(
									(Big(value) * _synths[i].price) /
										10 ** _synths[i].decimal
								)
								.toString()
					  );
			}
		}
		setSynths(_synths);
	};

	const availableToBorrow = () => {
		return (100 * totalCollateral) / safeCRatio - totalDebt;
	};

	const cRatio = () => {
		return totalCollateral / totalDebt;
	};

	const value: AppDataValue = {
		isDataReady,
		collaterals,
		totalCollateral,
		synths,
		totalDebt,
		pools,
		tradingPool,
		setTradingPool,
		fetchData,
		dataFetchError,
		dollarFormatter,
		tokenFormatter,
		tradingBalanceOf,
		minCRatio,
		safeCRatio,
		availableToBorrow,
		cRatio,
		isFetchingData,
		updateCollateralWalletBalance,
		updateCollateralAmount,
		updateSynthWalletBalance,
		updateSynthAmount,
	};

	return (
		<AppDataContext.Provider value={value}>
			{children}
		</AppDataContext.Provider>
	);
}

interface AppDataValue {
	isDataReady: boolean;
	collaterals: any[];
	totalCollateral: number;
	synths: any[];
	totalDebt: number;
	pools: any[];
	fetchData: (__: ChainID, _: any, ___: string) => void;// Promise<unknown>|undefined;
	tradingPool: number;
	setTradingPool: (_: number) => void;
	dataFetchError: string | null;
	dollarFormatter: any;
	tokenFormatter: any;
	tradingBalanceOf: (_: string) => number;
	minCRatio: number;
	safeCRatio: number;
	availableToBorrow: () => number;
	cRatio: () => number;
	isFetchingData: boolean;
	updateCollateralWalletBalance: (
		_: string,
		__: string,
		___: boolean
	) => void;
	updateCollateralAmount: (_: string, ___: string, ____: boolean) => void;
	updateSynthWalletBalance: (_: string, __: string, ___: boolean) => void;
	updateSynthAmount: (
		_: string,
		__: number,
		___: string,
		____: boolean
	) => void;
}

export { AppDataProvider, AppDataContext };
