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
import { WalletContext } from '../components/WalletContextProvider';
import Swap from '../components/Swap';
import ExchangeSideBar from '../components/TradingSideBar';
import { AppDataContext } from '../components/AppDataProvider';

function Exchange() {
	const {
		isDataReady,
	} = useContext(AppDataContext);


	return (
		<>
			{isDataReady && <Flex justifyContent={"space-between"} gap={10} wrap="wrap-reverse">
				<Box width={'35%'}>
					<ExchangeSideBar />
				</Box>
				<Box mt={10} width='60%' color="white">
					<Swap />
				</Box>
			</Flex>}
		</>
	);
}

export default Exchange;
