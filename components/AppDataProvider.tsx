import * as React from 'react';
import axios from 'axios';
import { getContract, call } from '../src/contract';
import { Endpoints } from '../src/const';
import { ChainID } from '../src/chains';
const { Big } = require('big.js');

const AppDataContext = React.createContext<AppDataValue>({} as AppDataValue);
const collateralsConfig = require('../artifacts/collaterals.json');
const synthsConfig = require('../artifacts/synths.json');
const tradingPoolsConfig = require('../artifacts/tradingPools.json');

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
	const [tradingPool, setTradingPool] = React.useState(1);
	const [dollarFormatter, setDollarFormatter] = React.useState<null | {}>(
		null
	);
	const [tokenFormatter, setTokenFormatter] = React.useState<null | {}>(null);
	const [minCRatio, setMinCRatio] = React.useState(130);
	const [safeCRatio, setSafeCRatio] = React.useState(200);

	const [chain, setChain] = React.useState(0);

	React.useEffect(() => {
		setDollarFormatter(
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			})
		);
		setTokenFormatter(new Intl.NumberFormat('en-US', {
			maximumSignificantDigits: 8
		}));
		fetchData(DUMMY_ADDRESS, ChainID.NILE);
	}, []);

	const tradingBalanceOf = (_s: string) => {
		for (let i in synths) {
			if (synths[i].synth_id == _s) {
				return synths[i].amount[tradingPool];
			}
		}
	};

	const fetchData = (_address: string, chainId: number) => {
		return new Promise((resolve, reject) => {
			setIsFetchingData(true);
			console.log('Fetching data...', Endpoints[chainId]);
			Promise.all([
				axios.get(Endpoints[chainId]+'assets/synths'),
				axios.get(Endpoints[chainId]+'assets/collaterals'),
				axios.get(Endpoints[chainId]+'pool/all'),
				axios.get(Endpoints[chainId]+'system'),
			])
				.then(async (res) => {
					let contract = await getContract('Helper', chainId);
					Promise.all([_setSynths(
						res[2].data.data,
						res[0].data.data,
						contract,
						_address,
						chainId
					),
					_setCollaterals(
						res[1].data.data,
						contract,
						_address,
						chainId
					)]).then((_) => {
                        setMinCRatio(res[3].data.data.minCollateralRatio);
                        setSafeCRatio(res[3].data.data.safeCollateralRatio);
                        resolve(null)
                    })
                    .catch(err => {
						console.log('Error', err);
                        reject(err)
                    })
				})
				.catch((err) => {
					console.log('error', err)
					setDataFetchError(
						'Failed to fetch data. Please refresh the page.'
					);
                    reject(err)
				});
		});
	};

	const _setCollaterals = (
		_collaterals: any,
		helper: any,
		_address: string,
		_chain: number
	) => {
		return new Promise((resolve, reject) => {
			let tokens = [];
			for (let i in _collaterals) {
				tokens.push(_collaterals[i].coll_address);
				tokens.push(_collaterals[i].cAsset);
			}

				call(helper, 'balanceOf', [tokens, _address], _chain)
				.then((res: any) => {
					console.log('balanceOf', res);
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
					console.log('collaterals', _collaterals);
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
		console.log('settin', _collaterals);
		setCollaterals(_collaterals);
	};

	const _setSynths = (
		_tradingPools: any,
		_synths: any,
		helper: any,
		_address: string,
		_chain: number
	) => {
		return new Promise((resolve, reject) => {
			let tokens: string[] = [];
			for (let i in _synths) {
				tokens.push(_synths[i].synth_id);
			}

			Promise.all([
				call(helper, 'balanceOf', [tokens, _address], _chain),
				call(helper, 'debtBalanceOf', [tokens, _address], _chain)
			])
				.then((res: any) => {
					let walletBalances = res[0];
					let debtBalances = res[1];

					let totalDebt = 0;

					for (let i = 0; i < walletBalances.length; i++) {
						_synths[i]['walletBalance'] =
							walletBalances[i].toString();
					}

					for (let i = 0; i < debtBalances.length; i++) {
						_synths[i]['amount'] = [debtBalances[i].toString()];
						totalDebt +=
							Number(debtBalances[i] / 1e18) * _synths[i].price;
					}

					console.log(_tradingPools);
					let tradingPoolAddresses: string[] = [];
					for (let i in _tradingPools) {
						tradingPoolAddresses.push(
							_tradingPools[i].pool_address
						);
					}

					_tradingPools.splice(0, 0, {
						pool_address:
							'0x0000000000000000000000000000000000000000',
						name: 'My Wallet',
						symbol: 'USER',
					});

					setPools(_tradingPools);

					let poolUserDataRequests: any = [];
					for (let i in tradingPoolAddresses) {
						poolUserDataRequests.push(
							// helper.tradingBalanceOf(
							// 		tradingPoolAddresses[i],
							// 		tokens,
							// 		_address
							// 	).call()

								call(helper, 'tradingBalanceOf', [tradingPoolAddresses[i], tokens, _address], _chain)
						);
					}

					Promise.all(poolUserDataRequests)
						.then((res: any) => {
							for (let i in res) {
								for (let j = 0; j < res[i].length; j++) {
									if (!_synths[j].amount) _synths[j]['amount'] = [];
									_synths[j]['amount'].push(res[i][j].toString());
									totalDebt += Number(res[i][j] / 1e18) * _synths[j].price;
								}
							}
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
		chain, setChain
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
	fetchData: (_address: string, chainId: number) => Promise<unknown>|undefined;
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
	chain: number; 
	setChain: (_: number) => void;
}

export { AppDataProvider, AppDataContext };
