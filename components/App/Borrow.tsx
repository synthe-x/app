import { Box, Flex, Text, Divider } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AppDataContext } from '../context/AppDataProvider';
import Stats from './Stats';
import { tokenFormatter } from '../../src/const';

export default function Borrow() {
	const {
		totalCollateral,
		totalDebt,
		availableToBorrow,
		adjustedCollateral, adjustedDebt,
		minCRatio,
		safeCRatio,
		dollarFormatter,
	} = useContext(AppDataContext);

	return (
		<Flex
			flexDir={'column'}
			justify="space-between"
			bgColor="#171717"
			rounded={15}
			px={'30px'}
			py="22px"
			height={'100%'}
			>
			<Flex flexDir={'column'} justify={'space-between'} height={'50%'}>
				<Flex justify={'space-between'}>
					<Box>
						<Text fontSize={'sm'}>Borrow Balance</Text>
						<Text fontSize={'2xl'} fontWeight="bold">
							{dollarFormatter?.format(totalDebt)}
						</Text>
					</Box>

					{/* <Box textAlign={'right'}>
						<Text fontSize={'sm'}>Available to Borrow</Text>
						<Text fontSize={'2xl'} fontWeight="bold">
							{dollarFormatter?.format(availableToBorrow())}
						</Text>
					</Box> */}
					{/* <Box textAlign={'right'}>
						<Text fontSize={'sm'}>Health Factor</Text>
						<Text fontSize={'2xl'} fontWeight="bold">
							{tokenFormatter?.format(adjustedCollateral/adjustedDebt)}
						</Text>
					</Box> */}
				</Flex>
				{/* <Stats/> */}
			</Flex>

			<Divider mb={4} borderColor={'#3C3C3C'}/>
			<Flex flexDir={'column'} justify='space-between' height={'50%'} >
				<Flex justify={'space-between'}>
					{/* <Box>
						<Text fontSize={'sm'}>Collateralisation Ratio</Text>
						<Text fontSize={'xl'} fontWeight="bold">
							{((100 * totalCollateral) / totalDebt).toFixed(2)} %
						</Text>
					</Box> */}
					<Box textAlign={'left'}>
						<Text fontSize={'sm'}>Health Factor</Text>
						<Text fontSize={'2xl'} fontWeight="bold">
							{tokenFormatter?.format(adjustedCollateral/adjustedDebt)}
						</Text>
						<Text fontSize={'sm'} color='gray'>Min 1.00</Text>
					</Box>

					{/* <Box textAlign={'left'}>
						<Text fontSize={'sm'}>Minimum Required</Text>
						<Text fontSize={'xl'} fontWeight="bold">
							{minCRatio} %
						</Text>
					</Box> */}
				</Flex>

				{/* <Box textAlign={'right'} mt={5}>
					<Text mb={1.5} fontSize={'sm'} color='gray'>Safe Minimum: 130 %</Text>
					<Flex width={'100%'}>
						<Box minH={4} roundedLeft={10} bgColor='primary' width={(((100 * totalCollateral) / totalDebt) - safeCRatio)/safeCRatio}></Box>
						<Box minH={4} roundedRight={10} bgColor='gray.700' width={'100%'}></Box>
					</Flex>
				</Box> */}
			</Flex>
		</Flex>
	);
}
