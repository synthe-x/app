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
	Skeleton,
} from '@chakra-ui/react';

import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Swap from '../components/Swap';
import ExchangeSideBar from '../components/TradingSideBar';
import { AppDataContext } from '../components/AppDataProvider';

function Exchange() {
	const { isDataReady } = useContext(AppDataContext);

	return (
		<>
			{isDataReady && (
				<Flex
					mt={'10'}
					gap={'1%'}
					wrap="wrap-reverse"
					align="stretch"
					justify="stretch"
					mb={10}>
					<Box
						width={'35%'}
						px={5}
						bgColor={'#171717'}
						color={'white'}
						rounded={10}>
						<ExchangeSideBar />
					</Box>
					<Box
						my={'auto'}
						width="64%"
						bgColor={'#171717'}
						color={'white'}
						rounded={10}>
						<Swap />
					</Box>
				</Flex>
			)}
		</>
	);
}

export default Exchange;
