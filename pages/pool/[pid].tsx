import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { WalletContext } from '../../components/WalletContextProvider';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Image,
} from '@chakra-ui/react';
import Bar from '../../components/charts/Bar';
import EnterPool from '../../components/EnterPool';
import ExitPool from '../../components/ExitPool';

import { MdArrowBackIos } from 'react-icons/md';
import { useEffect } from 'react';

import React from 'react';
import PoolPie from '../../components/charts/PoolPie';
import axios from 'axios';
import PoolTable from '../../components/charts/PoolTable';

const dollarFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});
const tokenFormatter = new Intl.NumberFormat('en-US');

const Pool = () => {
	const router = useRouter();
	const { pid } = router.query;
	const [liquidity, setLiquidity] = React.useState(0);
	const [pool, setPool] = React.useState<any>({});
	const [pieData, setPieData] = React.useState([]);

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		collaterals,
		synths,
		totalCollateral,
		totalDebt,
		isDataReady,
		connectionError,
		pools,
		// tokenFormatter,
		// dollarFormatter,
	} = useContext(WalletContext);

	const [volume, setVolume] = React.useState<{}[]>([]);
	const [_24h, set24h] = React.useState(0);
	const [totalVolume, setTotalVolume] = React.useState(0);


	useEffect(() => {
		let _pool: any;
		let _poolIndex = 0;
		for (let i in pools) {
			// 	pools.find(
			// 	(pool: any, index: number) => pool?.pool_address == pid
			// )
			if (pools[i]?.pool_address == pid) {
				_pool = pools[i];
				_poolIndex = Number(i);
			}
		}

		if (_pool) {
			setPool(_pool);

			let _liquidity = 0;
			for (let i in _pool.poolSynth_ids) {
				_liquidity +=
					(_pool.poolSynth_ids[i].balance *
						_pool.poolSynth_ids[i].price) /
					10 ** 18;
			}
			setLiquidity(_liquidity);

			let _pieData = [];
			for (let i in _pool.poolSynth_ids) {
				_pieData.push({
					name: _pool.poolSynth_ids[i].symbol,
					value:
						(_pool.poolSynth_ids[i].balance *
							_pool.poolSynth_ids[i].price) /
						10 ** 18,
				});
			}

			axios
				.get('https://api.synthex.finance/pool/volume/' + _poolIndex)
				.then((resp) => {
					const dayId =
						Math.round(Date.now() / (1000 * 60 * 60 * 24)) + 1;
					let _24hvolume = 0;
					let _totalVolume = 0
					for (let i in resp.data.data) {
						for (let j in _pool.poolSynth_ids) {
							if (resp.data.data[i].dayId == dayId) {
								_24hvolume +=
								resp.data.data[i][
									_pool.poolSynth_ids[j].symbol
								] * _pool.poolSynth_ids[j].price;
							}
							_totalVolume += resp.data.data[i][
								_pool.poolSynth_ids[j].symbol
							] * _pool.poolSynth_ids[j].price;
						}
						
						for (let j in _pool.poolSynth_ids) {
							resp.data.data[i][_pool.poolSynth_ids[j].symbol] = (
								resp.data.data[i][
									_pool.poolSynth_ids[j].symbol
								] * _pool.poolSynth_ids[j].price
							).toFixed(2);
						}
					}

					set24h(_24hvolume);
					setTotalVolume(_totalVolume)

					for (let i in resp.data.data) {
						resp.data.data[i].dayId = new Date(
							resp.data.data[i].dayId * 24 * 60 * 60 * 1000
						)
							.toDateString()
							.split(' ')
							.slice(1)
							.join(' ');
					}
					setVolume(resp.data.data);
				});

			setPieData(_pieData as []);
		}
	}, [pid, pools]);

	return (
		<>
			{pool && synths ? (
				<Box mt={5}>
					<Link
						color={'whiteAlpha.700'}
						display={'flex'}
						alignItems="center"
						mb={5}
						href="/pools">
						<MdArrowBackIos /> Back
					</Link>
					<Flex justify={'space-between'} mb={10} color="white">
						<Box>
							<Heading size={'lg'}>{pool?.name}</Heading>
							<Text fontSize={'md'} my={2}>
								{pool.symbol}
							</Text>
						</Box>

						<Box textAlign="right">
							<Text
								fontSize={'xs'}
								fontWeight="bold"
								color={'gray'}>
								TOTAL LIQUIDITY
							</Text>
							<Text fontSize={'xl'}>
								{dollarFormatter.format(liquidity)}
							</Text>
							<Text
								fontSize={'xs'}
								fontWeight="bold"
								color={'gray'}
								mt={5}>
								24H VOLUME
							</Text>
							<Text fontSize={'xl'}>
								{dollarFormatter.format(_24h)}
							</Text>
						</Box>
					</Flex>

					{/* <Text fontSize={"md"} my={2}>Total Collateral: {pool?.totalCollateral}</Text> */}
					<Flex gap={10}>
						<Flex
							flexDirection={'column'}
							justify="space-evenly"
							width={'75%'}
							minH="200px"
							bgColor="white"
							rounded={20}
							px={10}
							boxShadow={'lg'}
							pb={5}
							flex="1"
							>
							<Box height={'80%'} >
								<PoolPie data={pieData} />
							</Box>
							<Flex gap={4} height="20%" align={"end"}
							>
								<Box width={'50%'}>
									<EnterPool assets={synths} pool={pool} />
								</Box>

								<Box width={'50%'}>
									<ExitPool
										assets={synths}
										pool={pool}
										width={'100%'}
									/>
								</Box>
							</Flex>
						</Flex>
						<Box boxShadow={'lg'} rounded={10} minH="200px" width={"20%"} flex="0.75">
							<PoolTable pool={pool} />
						</Box>
					</Flex>
					<Box
						width={'100%'}
						height="550px"
						my={10}
						textAlign="center"
						bgColor={'white'}
						p={8}
						rounded={20}
						boxShadow={'lg'}>
						<Bar data={volume} poolSynths={pool.poolSynth_ids} />
						<Box mt={3} color="gray">
							<Text fontSize={"sm"}>Total Volume</Text>
							<Text>{dollarFormatter.format(totalVolume)}</Text>
						</Box>
					</Box>
				</Box>
			) : (
				<>Loading</>
			)}
		</>
	);
};

export default Pool;
