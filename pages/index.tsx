import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Image,
	Button
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import IssuanceTable from '../components/IssuanceTable';
import CollateralTable from '../components/CollateralTable';
import { useContext, useEffect, useState } from 'react';
import { getContract } from '../src/utils';
import { useAccount } from 'wagmi';
import web3 from 'web3';
import { WalletContext } from '../components/WalletContextProvider';
import ConnectButton from '../components/ConnectButton';
import { BiArrowToRight, BiError, BiErrorAlt } from 'react-icons/bi';
import { AppDataContext } from '../components/AppDataProvider';
import Collateral from '../components/App/Collateral';
import Chart from '../components/App/Chart';
import Borrow from '../components/App/Borrow';
import { Heading } from '@chakra-ui/react';
import { BsArrowBarRight, BsArrowReturnRight } from 'react-icons/bs';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Link from 'next/link';

function App() {
	const [nullValue, setNullValue] = useState(false);

	const handleChange = () => {
		setNullValue(!nullValue);
	};

	const TableStyle = {
		px: '1rem',
		pt: '1rem',
		mb: { sm: '1rem', md: '0' },
		width: { sm: '100%', md: '100%', lg: '50%' },
		flex: '1',
		minH: '200px',
		bg: '#171717',
		color: '#fff',
		borderRadius: '20px',
		boxShadow: 'lg',
	};

	return (
		<>
			{
				<Flex flexDir={'column'} mt={10} mb={10} gap={3}>
					<Flex
						flexDirection={{
							sm: 'column',
							md: 'column',
							lg: 'row',
						}}
						color={'#fff'}
						align="stretch" 
						gap={3}
						>
						<Box width={{sm: '100%', md: '28%'}}>
							<Collateral handleChange={handleChange} />
						</Box>
						<Box width={{sm: '100%', md: '44%'}}>
							<Borrow />
						</Box>
						<Box width={{sm: '100%', md: '28%'}}>
							<Chart />
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
						{/* <Box {...TableStyle}>
							<CollateralTable handleChange={handleChange} />
						</Box> */}

						<Box {...TableStyle}>
							<IssuanceTable handleChange={handleChange} />
						</Box>
					</Flex>
					<Flex height={'200px'}  bgColor='secondary' rounded={20} px={'30px'} py={'22px'} color='white' width={'100%'}>
						<Flex flexDir={'column'} justify='space-between' width={'100%'}>
						<Box>
						<Heading>Trade with no slippage</Heading>
						<Text>Frictionless trading with no fees</Text>
						</Box>
						<Link href='/pools'>
						<Button maxW={'200px'} size='lg' bgColor='black' fontSize={'md'} rounded={10}>
							<Text mr={2}>Enter a Pool</Text> 
							<AiOutlineArrowRight/> </Button>
						</Link>

						</Flex>
						<Box bgImage='/swapmockup.png' bgSize={'350px'} bgRepeat='no-repeat' width={'45%'} mx={'-10px'} mt={-10} my={'-22px'}>

						</Box>
					</Flex>
				</Flex>
			}
		</>
	);
}

export default App;
