import { Box, Text, Flex, Divider, useColorMode, Progress } from '@chakra-ui/react';
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

function App() {
	const { colorMode } = useColorMode();
	const [minCRatio, setMinCRatio] = useState(0);
	const [safeCRatio, setSafeCRatio] = useState(0);

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
		isFetchingData,
		connectionError,
		availableToBorrow
	} = useContext(WalletContext);

	useEffect(() => {
		// getUserData();
		setMinCRatio(130);
		setSafeCRatio(200);
	}, []);

	function getUserData(_address: string | null = address) {
		axios
			.get('https://api.synthex.finance/user/' + _address + '/all')
			.then((res) => {
				setMinCRatio(res.data.data.minCRatio);
			});
	}

	const TableStyle = {
		px: "1rem",
		pt: "1rem",
		mb: {sm: '1rem', md: '0' },
		width: { sm: '100%', lg: '50%' },
		flex: "1",
		minH: "200px",
		bg: colorMode == 'dark' ? '#171717' : '#FFFFFF',
		borderRadius: '20px',
		boxShadow: 'lg'
	};

	return (
		<>
			{
				<Box mt={10}>	
					<Flex
						flexDirection={{ sm: 'column', lg: 'row' }}
						my="1rem"
						justifyContent="space-between"
						color={"#fff"}
						gap={5}>
						<Box
							display={'flex'}
							justifyContent="space-between"
							height="16rem"
							mb={{ sm: '1rem', lg: '0' }}
							width={{ sm: '100%', md: '50%', lg: '50%' }}
							>
							<Box w="100%">
								<Box w="7rem" h="0.3rem" bg="#36a2eb" rounded={100}></Box>
								<Text fontSize={'sm'}>Collateral Balance</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									$ {totalCollateral.toFixed(2)}
								</Text>

								<Divider my={4} />
								<Box w="5rem" h="0.3rem" bg="#ffcd56" rounded={100}></Box>
								<Text fontSize={'sm'}>Borrow Balance</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									$ {totalDebt.toFixed(2)}
								</Text>

								<Divider my={4} />
								<Box w="7rem" h="0.3rem" bg="#ff6384" rounded={100}></Box>
								<Text fontSize={'sm'}>Available to Borrow</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									${' '}
									{availableToBorrow().toFixed(2)}
								</Text>
							</Box>
						</Box>
						
						<Chart />

						<Box
							mt={{ sm: '1rem', md: '0' }}
							height="16rem"
							pt="1rem"
							// border={'3px solid #252525'}
							width={{ sm: '100%', md: '50%', lg: '50%' }}
							// bg={colorMode == 'dark' ? '#171717' : '#FFFFFF'}
							// borderRadius={'10px'}
							textAlign="right"
							>
							<Text fontSize={'sm'}>Stability Rate</Text>
							<Text fontSize={'xl'} fontWeight="bold">
								1.01%
							</Text>

							<Divider my={4} />
							<Text fontSize={'sm'}>Collateralisation Ratio</Text>
							<Text fontSize={'xl'} fontWeight="bold">
								{((100 * totalCollateral) / totalDebt).toFixed(
									2
								)}{' '}
								%
							</Text>
							<Divider my={4} />
							<Text fontSize={'sm'}>Minimum Required</Text>
							<Text fontSize={'xl'} fontWeight="bold">
								{minCRatio} %
							</Text>
						</Box>
					</Flex>
					<Flex
						flexDirection={{ sm: 'column', md: 'column', lg: 'row' }}
						justifyContent="space-between"
						gap={10}
						flexWrap="wrap"
						
						>
						<Box {...TableStyle}>
							<CollateralTable/>
						</Box>

						<Box {...TableStyle}>
							<IssuanceTable/>
						</Box>
					</Flex>
				</Box>
}
				
		</>
	);
}

export default App;
