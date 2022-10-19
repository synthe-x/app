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
			{pools.length > 0 && <Flex justifyContent={"space-between"} gap={20} wrap="wrap-reverse">
				<Box width={'35%'}>
					<ExchangeSideBar />
				</Box>
				<Box mt={10} width='50%' mr={"0"}>
					<Swap />
				</Box>
			</Flex>}
		</>
	);
}

export default Exchange;
