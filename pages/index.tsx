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

	return (
		<>
			{
			// isDataReady ? (
				<Box>
					
					<Flex
						flexDirection={{ sm: 'column', lg: 'row' }}
						my="1rem"
						justifyContent="space-around">
						<Box
							display={'flex'}
							justifyContent="space-between"
							height="16rem"
							p="0.8rem"
							// border={'3px solid #252525'}
							mb={{ sm: '1rem', lg: '0' }}
							width={{ sm: '100%', lg: '59.5%' }}
							// bg={colorMode == 'dark' ? '#171717' : '#FFFFFF'}
							// borderRadius={'10px'}
							>
							<Box w="70%">
								<Box w="7rem" h="0.3rem" bg="#36a2eb" rounded={100}></Box>
								<Text fontSize={'sm'}>Collateral Balance</Text>
								<Text fontSize={'lg'} fontWeight="bold">
									$ {totalCollateral.toFixed(2)}
								</Text>

								<Divider my={4} />
								<Box w="5rem" h="0.3rem" bg="#ffcd56" rounded={100}></Box>
								<Text fontSize={'sm'}>Borrow Balance</Text>
								<Text fontSize={'lg'} fontWeight="bold">
									$ {totalDebt.toFixed(2)}
								</Text>

								<Divider my={4} />
								<Box w="7rem" h="0.3rem" bg="#ff6384" rounded={100}></Box>
								<Text fontSize={'sm'}>Available to Borrow</Text>
								<Text fontSize={'lg'} fontWeight="bold">
									${' '}
									{availableToBorrow().toFixed(2)}
								</Text>
							</Box>

							<Chart />
						</Box>

						<Box
							mt={{ sm: '1rem', md: '0' }}
							height="16rem"
							p="1rem"
							// border={'3px solid #252525'}
							width={{ sm: '100%', lg: '39.5%' }}
							// bg={colorMode == 'dark' ? '#171717' : '#FFFFFF'}
							// borderRadius={'10px'}
							textAlign="right"
							>
							<Text fontSize={'sm'}>Stability Rate</Text>
							<Text fontSize={'lg'} fontWeight="bold">
								1.01%
							</Text>

							<Divider my={4} />
							<Text fontSize={'sm'}>Collateralisation Ratio</Text>
							<Text fontSize={'lg'} fontWeight="bold">
								{((100 * totalCollateral) / totalDebt).toFixed(
									2
								)}{' '}
								%
							</Text>
							<Divider my={4} />
							<Text fontSize={'sm'}>Minimum Required</Text>
							<Text fontSize={'lg'} fontWeight="bold">
								{minCRatio} %
							</Text>
						</Box>
					</Flex>
					<Flex
						flexDirection={{ sm: 'column', lg: 'row' }}
						justifyContent="space-between">
						<Box
							mb={{ sm: '1rem', lg: '0' }}
							border={'3px solid #252525'}
							overflowX="auto"
							px="0.5rem"
							width={{ sm: '100%', lg: '44.2%' }}
							bg={colorMode == 'dark' ? '#171717' : '#FFFFFF'}
							borderRadius={'10px'}>
							<CollateralTable/>
						</Box>

						<Box
							px="0.5rem"
							border={'3px solid #252525'}
							mb={{ sm: '1rem', md: '0' }}
							width={{ sm: '100%', lg: '54.2%' }}
							bg={colorMode == 'dark' ? '#171717' : '#FFFFFF'}
							borderRadius={'10px'}>
							<IssuanceTable/>
						</Box>
					</Flex>
				</Box>
			// ) : (
			// 	<Progress size='xs' isIndeterminate colorScheme={"whatsapp"}></Progress>
			// ) 
}
				
		</>
	);
}

export default App;
