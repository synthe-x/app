import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Input,
	Select,
	Button,
} from '@chakra-ui/react';
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
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import IssuanceTable from '../components/IssuanceTable';
import CollateralTable from '../components/CollateralTable';
import { useContext, useEffect, useState } from 'react';
import { getContract } from '../src/utils';
import { useAccount } from 'wagmi';
import web3 from 'web3';
import Chart from '../components/DonutChart';
import axios from 'axios';
import { WalletContext } from '../components/WalletContextProvider';
import ConnectButton from '../components/ConnectButton';
import Swap from '../components/Swap';
import { AiOutlineEnter } from 'react-icons/ai';
import { BiExit } from 'react-icons/bi';
import TransferModal from './modals/TransferModal';
import { MdOpenInNew } from 'react-icons/md';
import Link from 'next/link';

function ExchangeSideBar() {
	const { colorMode } = useColorMode();

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		synths,
		totalDebt,
		isDataReady,
		tradingPool,
		setTradingPool,
		pools,
		poolUserData,
	} = useContext(WalletContext);

	const updatePoolIndex = (e: any) => {
		setTradingPool(e.target.value);
	};

	return (
		<>
			<Box>
                <Text mt={10} mb={2} fontSize={"xs"} fontWeight="bold" color={"#626262"} ml={1}>CHOOSE A POOL</Text>
				<Select
					mb={10}
					onChange={updatePoolIndex}
					value={tradingPool}
					bgColor={'#171717'}
					// height="100"
                    >
					{pools.map((pool: any, index: number) => {
						return (
							<option key={pool['symbol']} value={index}>
								<Text>{pool['name']}</Text>
							</option>
						);
					})}
				</Select>
				<TableContainer border={"1px solid #2C2C2C"} rounded={6} py={2} bgColor="#171717">
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Asset</Th>
								<Th>Balance</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{synths.map((_synth: any, index: number) => {
								return (
									<Tr key={index}>
										<Td>
											{_synth.name
												.split(' ')
												.slice(1)
												.join(' ')}
										</Td>
										<Td>
											{(_synth.amount[tradingPool]/10**_synth.decimal).toFixed(2)}{' '}
											{_synth.symbol}
										</Td>
										<Td>
                                            <TransferModal asset={_synth} />
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}

export default ExchangeSideBar;
