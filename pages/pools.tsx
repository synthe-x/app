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
	const { colorMode } = useColorMode();
	const [minCRatio, setMinCRatio] = useState(0);

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
	} = useContext(WalletContext);

	useEffect(() => {
		// getUserData();
		setMinCRatio(130);
	}, []);

	function getUserData(_address: string | null = address) {
		axios
			.get('https://api.synthex.finance/user/' + _address + '/all')
			.then((res) => {
				setMinCRatio(res.data.data.minCRatio);
			});
	}

	return (
		<>
			{connectionError.length == 0 ? (
				isConnected ? (
					isDataReady ? (
						<Box>
							<Heading size={'md'} fontWeight="bold" mt={10}>
								Trading Pools
							</Heading>
							{pools.slice(1).map((pool: any, index: number) => {
								return (
									<PoolCard key={index} pool={pool} />
								);
							})}
						</Box>
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
							<Text fontSize={'md'} mb={5}>
								Please connect your wallet to continue
							</Text>
						</Box>
					</Flex>
				)
			) : (
				<Flex justify={'center'}>
					<Box
						width="400px"
						height={200}
						textAlign={'center'}
						p={5}
						rounded={10}>
						<BiErrorAlt size={'sm'} color="red.600" />
						<Text fontSize={'lg'} mb={5} color="red.600">
							Error: {connectionError}
						</Text>
					</Box>
				</Flex>
			)}
		</>
	);
}

export default App;
