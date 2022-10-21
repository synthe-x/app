import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Wrap,
	WrapItem,
	Avatar,
    Heading,
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
import { BiError, BiErrorAlt } from 'react-icons/bi';
import PoolCard from '../components/PoolCard';

function App() {
	const {
		pools,
	} = useContext(WalletContext);

	return (
		<>
			<Box mb={20}>
				<Text fontSize={'xl'} fontWeight="bold" mt={10} color="whiteAlpha.800">
					TRADING POOLS
				</Text>
				{/* <Text color={"whiteAlpha.700"}>
					Trade without frictions
				</Text> */}
				<Flex flexDirection={"column"} gap={10} my={6}>
				{pools.slice(1).map((pool: any, index: number) => {
					return (
						<PoolCard key={index} pool={pool} />
					);
				})}
				</Flex>
			</Box>
		</>
	);
}

export default App;
