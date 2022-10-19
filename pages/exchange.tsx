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
import ExchangeSideBar from '../components/TradingSideBar';
import { BiErrorAlt } from 'react-icons/bi';

function Exchange() {
	const { colorMode } = useColorMode();
	const [minCRatio, setMinCRatio] = useState(0);

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
		connectionError
	} = useContext(WalletContext);

	const updatePoolIndex = (e: any) => {
		setTradingPool(e.target.value);
	};

	return (
		<>
			{connectionError.length == 0? isConnected ? (
				isDataReady ? (
					<Flex justifyContent={"space-between"} gap={20} wrap="wrap-reverse">
						<Box width={'35%'}>
							<ExchangeSideBar />
						</Box>
						<Box mt={10} width='50%' mr={"0"}>
							<Swap />
						</Box>
					</Flex>
				) : (
					<Progress
						size="xs"
						isIndeterminate
						colorScheme={'whatsapp'}></Progress>
				)
			) : (
				<Flex justify={'center'}>
					<Box
						width="400px"
						height={200}
						textAlign={'center'}
						p={5}
						rounded={10}>
						{isConnecting ? <Text fontSize={'md'} mb={5}>
							Open your wallet to connect
						</Text> : <Text fontSize={'md'} mb={5}>
							Please connect your wallet to continue
						</Text>
						}
					</Box>
				</Flex>
			): 
			<Flex justify={"center"}>
			<Box width="400px" height={200} textAlign={"center"} p={5} rounded={10}>
				<BiErrorAlt size={"sm"} color="red.600"/>
				<Text fontSize={"lg"} mb={5} color='red.600'>Error: {connectionError}</Text>
			</Box>
			</Flex>}
		</>
	);
}

export default Exchange;
