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
import { useContext, useState } from 'react';
import { WalletContext } from '../components/WalletContextProvider';
import { AppDataContext } from './AppDataProvider';
import TransferModal from './modals/TransferModal';

function ExchangeSideBar({}) {
	const [nullValue, setNullValue] = useState(false);

	const {
		isConnected,
		isConnecting,
		address,
		connect,
	} = useContext(WalletContext);

	const {
		synths,
		totalDebt,
		isDataReady,
		tradingPool,
		setTradingPool,
		pools,
		tradingBalanceOf
	} = useContext(AppDataContext);

	const updatePoolIndex = (e: any) => {
		setTradingPool(e.target.value);
	};

	const getSynth = (address: string) => {
		return synths.find((s: any) => s.synth_id === address);
	}

	const handleUpdate = () => {
		setNullValue(!nullValue);
	}

	return (
		<>
                <Text mb={2} mt={6} fontSize={"xs"} fontWeight="bold" color={"gray"} ml={1}>CHOOSE A POOL</Text>
				<Select
					mb={10}
					onChange={updatePoolIndex}
					value={tradingPool}
                    >
					{pools.map((pool: any, index: number) => {
						return (
							<option key={pool?.symbol} value={index} >
								<Text>{pool?.name}</Text>
							</option>
						);
					})}
				</Select>
				
				<TableContainer rounded={6} bgColor="#171717" color={"white"}>
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th color="#686868" borderColor={'#3C3C3C'}>Asset</Th>
								<Th color="#686868" borderColor={'#3C3C3C'}>Balance</Th>
								<Th borderColor={'#3C3C3C'}></Th>
							</Tr>
						</Thead>
						<Tbody>
							{((pools[tradingPool] && pools[tradingPool].poolSynth_ids) ?? synths).map((_synth: any, index: number) => {
								return (
									<Tr key={index} >
										<Td borderColor={'#3C3C3C'}>
											{_synth.name
												.split(' ')
												.slice(1)
												.join(' ')}
										</Td>
										<Td borderColor={'#3C3C3C'}>
											{(tradingBalanceOf(_synth.synth_id)/10**(_synth.decimal ?? 18)).toFixed(2)}{' '}
											{_synth.symbol}
										</Td>
										<Td borderColor={'#3C3C3C'}>
                                            <TransferModal asset={getSynth(_synth.synth_id)} handleUpdate={handleUpdate} />
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
		</>
	);
}

export default ExchangeSideBar;
