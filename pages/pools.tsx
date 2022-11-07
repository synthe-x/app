import {
	Box,
	Text,
	Flex,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import PoolCard from '../components/PoolCard';
import { AppDataContext } from '../components/AppDataProvider';

function App() {
	const {
		pools,
	} = useContext(AppDataContext);

	return (
		<>
			<Box mb={20}>
				<Text fontSize={'2xl'} fontWeight="bold" mt={10} color="whiteAlpha.800">
					Trading Pools
				</Text>
				<Text color={"whiteAlpha.700"} fontSize="sm">
					Trade without frictions
				</Text>
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
