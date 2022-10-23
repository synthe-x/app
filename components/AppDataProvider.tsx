import * as React from 'react';
import axios from 'axios';
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
	const [tradingPool, setTradingPool] = React.useState(0);
	const [dollarFormatter, setDollarFormatter] = React.useState<null | {}>(
		null
	);
	const [tokenFormatter, setTokenFormatter] = React.useState<null | {}>(null);
	const [minCRatio, setMinCRatio] = React.useState(130);
	const [safeCRatio, setSafeCRatio] = React.useState(200);

	React.useEffect(() => {
		setDollarFormatter(
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			})
		);
		setTokenFormatter(new Intl.NumberFormat('en-US'));
		fetchData(tronWebObject, DUMMY_ADDRESS);
	}, []);

	const tradingBalanceOf = (_s: string) => {
		for (let i in synths) {
			if (synths[i].synth_id == _s) {
				return synths[i].amount[tradingPool];
			}
		}
	};

	const fetchData = (_tronWeb: any, _address: string) => {
        if(_tronWeb) _tronWeb = tronWebObject
        if(!_tronWeb.contract) return
		return new Promise((resolve, reject) => {
			setIsFetchingData(true);
			console.log('Fetching data...');
			Promise.all([
				axios.get('https://api.synthex.finance/assets/synths'),
				axios.get('https://api.synthex.finance/assets/collaterals'),
				axios.get('https://api.synthex.finance/pool/all'),
				axios.get('https://api.synthex.finance/system'),
			])
				.then(async (res) => {
					let contract = await _tronWeb.contract().at('TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE');
					Promise.all([_setSynths(
						res[2].data.data,
						res[0].data.data,
						contract,
						_tronWeb,
						_address
					),
					_setCollaterals(
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

	const fetchDataLocal = async (_tronWeb: any, _address: string) => {
		let contract = await _tronWeb
			.contract()
			.at('TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE');
		_setSynths(
			tradingPoolsConfig,
			synthsConfig,
			contract,
			_tronWeb,
			_address
		);
		_setCollaterals(collateralsConfig, contract, _tronWeb, _address);
	};

	const _setCollaterals = (
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

			contract
				.balanceOf(tokens, _address)
				.call()
				.then((res: any) => {
					res = res[0];
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
		_tradingPools: any,
		_synths: any,
		contract: any,
		_tronWeb: string,
		_address: string
	) => {
		return new Promise((resolve, reject) => {
			let tokens: string[] = [];
			console.log(_synths);
			for (let i in _synths) {
				tokens.push(_synths[i].synth_id);
			}

			Promise.all([
				contract.balanceOf(tokens, _address).call(),
				contract.debtBalanceOf(tokens, _address).call(),
			])
				.then((res: any) => {
					let walletBalances = res[0][0];
					let debtBalances = res[1][0];

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
							contract
								.tradingBalanceOf(
									tradingPoolAddresses[i],
									tokens,
									_address
								)
								.call()
						);
					}

					Promise.all(poolUserDataRequests)
						.then((res: any) => {
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
	fetchData: (_tronWeb: any, _address: string) => Promise<unknown>|undefined;
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
