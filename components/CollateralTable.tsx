import React, { useContext } from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	Button,
	useDisclosure,
	TableContainer,
	Box,
	Text,
	Flex,
	useColorMode,
	Skeleton,
} from '@chakra-ui/react';

import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';

import Image from 'next/image';
import { getContract } from '../src/contract';
import { useState } from 'react';
import { WalletContext } from './context/WalletContextProvider';
import { AppDataContext } from './context/AppDataProvider';
import { ChainID } from '../src/chains';

const CollateralTable = ({handleChange}: any) => {
	const [claimLoading, setClaimLoading] = useState(false);
	const [nullValue, setNullValue] = useState(false);

	const {
		isConnected,
		tronWeb,
	} = useContext(WalletContext);

	const {
		collaterals,
		tokenFormatter,
		dollarFormatter,
		updateCollateralWalletBalance,
		updateCollateralAmount,
		chain
	} = useContext(AppDataContext);

	const claim = async () => {
		setClaimLoading(true);
		let wtrx = await getContract('WTRX', chain);
		wtrx.deposit().send({}, (err: any, hash: string) => {
			if (err) {
				console.log(err);
				setClaimLoading(false);
			}
			if (hash) {
				console.log(hash);
				setClaimLoading(false);
				updateCollateralWalletBalance(wtrx.address, "100000000000", false)
				handleChange()
			}
		});
	};

	const handleDeposit = (collateral: string, value: string) => {
		updateCollateralWalletBalance(collateral, value, true)
		updateCollateralAmount(collateral, value, false)
		setNullValue(!nullValue);
		handleChange()
	}

	const handleWithdraw = (collateral: string, value: string) => {
		updateCollateralWalletBalance(collateral, value, false)
		updateCollateralAmount(collateral, value, true)
		setNullValue(!nullValue);
		handleChange()
	}

	// console.log(collaterals);

	return (
		<Skeleton isLoaded={collaterals.length > 0}>
			<TableContainer>
				<Table overflow={'auto'} variant="simple">
					<Thead>
						<Tr>
							<Th
								color={'gray.500'}
								fontSize={'xs'}
								fontFamily="Poppins">
								Collateral Assets
							</Th>
							<Th
								color={'gray.500'}
								fontSize={'xs'}
								fontFamily="Poppins">
								Protocol Balance
							</Th>
							<Th
								color={'gray.500'}
								fontSize={'xs'}
								fontFamily="Poppins"
								isNumeric></Th>
						</Tr>
					</Thead>
					<Tbody>
						{collaterals.map((collateral: any) => {
							return (
								<Tr key={collateral['symbol']}>
									<Td minW={'220px'}>
										<Box display="flex" alignItems="center">
											<Image
												src={`/${collateral?.symbol}.png`}
												width={35}
												height={35}
												alt="logo"
											/>
											<Box ml={2}>
												<Text
													fontSize="sm"
													fontWeight="bold"
													textAlign={'left'}>
													{collateral['name']}
												</Text>
												<Text
													fontSize="xs"
													fontWeight="light"
													textAlign={'left'}>
													{collateral['symbol']}
												</Text>
												{collateral['symbol'] == "WTRX" && isConnected ? 
													<Button mt={1} isLoading={claimLoading} size={"xs"} rounded="100" colorScheme="whatsapp" onClick={claim}>Get WTRX Tokens</Button> 
												: <></>}
											</Box>
										</Box>
									</Td>

									<Td>
										<Box>
											<Text
												fontSize="sm"
												>
												{isConnected
													? tokenFormatter.format(
															collateral.amount /
																10 **
																	collateral.decimal
													  )
													: '-'}{' '}
												{collateral['symbol']}
											</Text>
											<Text
												fontSize="xs"
												textAlign={'left'}>
												{isConnected
													? dollarFormatter.format(
															(collateral.amount *
																collateral.price) /
																10 **
																	collateral.decimal
													  )
													: '-'}
											</Text>
										</Box>
									</Td>

									<Td isNumeric>
										<Flex alignItems={'center'}>
											<DepositModal
												asset={collateral}
												handleDeposit={handleDeposit}
											/>
											<WithdrawModal
												asset={collateral}
												handleWithdraw={handleWithdraw}
											/>
										</Flex>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</Skeleton>
	);
};

export default CollateralTable;
