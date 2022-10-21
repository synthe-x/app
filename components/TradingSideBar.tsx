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
} from '@chakra-ui/react';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { WalletContext } from '../components/WalletContextProvider';
import TransferModal from './modals/TransferModal';

function ExchangeSideBar({}) {
	const { colorMode } = useColorMode();

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		synths,
		totalDebt,
		isDataReady,
		tradingPool,
		setTradingPool,
		pools,
		poolUserData,
		tradingBalanceOf
	} = useContext(WalletContext);

	const updatePoolIndex = (e: any) => {
		setTradingPool(e.target.value);
	};

	const getSynth = (address: string) => {
		return synths.find((s: any) => s.synth_id === address);
	}

	return (
		<>
			<Box>
                <Text mt={10} mb={2} fontSize={"xs"} fontWeight="bold" color={"gray"} ml={1}>CHOOSE A POOL</Text>
				<Select
					mb={10}
					onChange={updatePoolIndex}
					value={tradingPool}
					color="white"
					// bgColor={'gray'}
					// height="100"
                    >
					{pools.map((pool: any, index: number) => {
						return (
							<option key={pool?.symbol} value={index} >
								<Text>{pool?.name}</Text>
							</option>
						);
					})}
				</Select>
				<TableContainer border={"1px solid #2C2C2C"} rounded={6} py={2} bgColor="#171717" color={"white"}>
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th color="#686868">Asset</Th>
								<Th color="#686868">Balance</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{((pools[tradingPool] && pools[tradingPool].poolSynth_ids) ?? synths).map((_synth: any, index: number) => {
								return (
									<Tr key={index}>
										<Td>
											{_synth.name
												.split(' ')
												.slice(1)
												.join(' ')}
										</Td>
										<Td>
											{(tradingBalanceOf(_synth.synth_id)/10**(_synth.decimal ?? 18)).toFixed(2)}{' '}
											{_synth.symbol}
										</Td>
										<Td>
                                            <TransferModal asset={getSynth(_synth.synth_id)} />
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}

export default ExchangeSideBar;
