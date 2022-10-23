import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
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
import { AppDataContext } from '../components/AppDataProvider';

function App() {
	const [nullValue, setNullValue] = useState(false);

	const handleChange = () => {
		setNullValue(!nullValue);
	};

	const {
		totalCollateral,
		totalDebt,
		availableToBorrow,
		minCRatio,
		safeCRatio,
		dollarFormatter,
	} = useContext(AppDataContext);

	const TableStyle = {
		px: '1rem',
		pt: '1rem',
		mb: { sm: '1rem', md: '0' },
		width: { sm: '100%', md: '100%', lg: '50%' },
		flex: '1',
		minH: '200px',
		bg: '#FFFFFF',
		borderRadius: '20px',
		boxShadow: 'lg',
	};

	return (
		<>
			{
				<Box mt={10} mb={20}>
					<Flex
						flexDirection={{ sm: 'column', md: 'column', lg: 'row' }}
						mb={10}
						color={'#fff'}
						align="start"
						
						>
						<Box
							display={'flex'}
							justifyContent="space-between"
							mb={{ sm: '1rem', lg: '0' }}
							width={{ sm: '100%', md: '50%' }}
							>
							<Flex
								flexDir={'column'}
								justify={{ sm: 'center', md: 'start' }}
								align={{ sm: 'center', md: 'start' }}
								w="100%">
								<Box
									w="7rem"
									h="0.3rem"
									bg="#36a2eb"
									rounded={100}></Box>
								<Text fontSize={'sm'}>Collateral Balance</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									{dollarFormatter?.format(totalCollateral)}
								</Text>

								<Divider my={4} borderColor={'gray.500'} />
								<Box
									w="5rem"
									h="0.3rem"
									bg="#ffcd56"
									rounded={100}></Box>
								<Text fontSize={'sm'}>Borrow Balance</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									{dollarFormatter?.format(totalDebt)}
								</Text>

								<Divider my={4} borderColor={'gray.500'} />
								<Box
									w="7rem"
									h="0.3rem"
									bg="#ff6384"
									rounded={100}></Box>
								<Text fontSize={'sm'}>Available to Borrow</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									{dollarFormatter?.format(
										availableToBorrow()
									)}
								</Text>
							</Flex>
						</Box>

						<Chart />

						<Box
							display={'flex'}
							justifyContent="space-between"
							mb={{ sm: '1rem', lg: '0' }}
							width={{ sm: '100%', md: '50%' }}
							>
							<Flex
								flexDir={'column'}
								justify={{ sm: 'center', md: 'end' }}
								align={{ sm: 'center', md: 'end' }}
								w="100%">
								<Text fontSize={'sm'}>Stability Rate</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									1.01%
								</Text>

								<Divider my={4} borderColor={'gray.500'} />
								<Text fontSize={'sm'}>
									Collateralisation Ratio
								</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									{(
										(100 * totalCollateral) /
										totalDebt
									).toFixed(2)}{' '}
									%
								</Text>
								<Divider my={4} borderColor={'gray.500'} />
								<Text fontSize={'sm'}>Minimum Required</Text>
								<Text fontSize={'xl'} fontWeight="bold">
									{minCRatio} %
								</Text>
							</Flex>
						</Box>
					</Flex>
					<Flex
						flexDirection={{
							sm: 'column',
							md: 'column',
							lg: 'row',
						}}
						justifyContent="space-between"
						gap={10}
						flexWrap="wrap">
						<Box {...TableStyle}>
							<CollateralTable handleChange={handleChange} />
						</Box>

						<Box {...TableStyle}>
							<IssuanceTable handleChange={handleChange} />
						</Box>
					</Flex>
				</Box>
			}
		</>
	);
}

export default App;
