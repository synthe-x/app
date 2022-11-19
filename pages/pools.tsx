import {
	Box,
	Text,
	Flex,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import PoolCard from '../components/PoolCard';
import { AppDataContext } from '../components/AppDataProvider';
import Head from 'next/head';

function App() {
	const {
		pools,
	} = useContext(AppDataContext);

	return (
		<>
			<Head>
				<title>Trading Pools | SyntheX</title>
				<link rel="icon" type="image/x-icon" href="/logo32.png"></link>
			</Head>
			<Box mb={10}>
				<Text fontSize={'3xl'} fontWeight="bold" mt={10} color="whiteAlpha.800">
					Trading Pools
				</Text>
				<Text color={"whiteAlpha.700"} fontSize="sm">
					No-slippage trading. Find the ideal pool for your trading needs
				</Text>
				<Flex flexDirection={"column"} gap={10} my={10}>
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
