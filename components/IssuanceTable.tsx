import React from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	TableContainer,
	Box,
	Text,
	Flex,
	useDisclosure,useColorMode
} from '@chakra-ui/react';

import Image from 'next/image';
import IssueModel from './modals/IssueModal';
import RepayModel from './modals/RepayModal';

const IssuanceTable = ({ debts, minCRatio, collateralBalance, cRatio }: any) => {
	const { colorMode } = useColorMode();
	const tknholdingImg = {
		width: '30px',
		marginLeft: '1rem',
		marginRight: '0.5rem',
		borderRadius: '100px',
	};

	return (
		<>
			<TableContainer>
				<Table  overflow={"auto"}
					variant="simple"
					style={{
						borderCollapse: 'separate',
						borderSpacing: '0 15px',
					}}>
					<Thead>
						<Tr  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Issuance Assets
							</Th>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Price
							</Th>
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								color={colorMode == "dark" ?"#858585" : "#171717"}
								>
								Protocol Debt
							</Th>
							{/* <Th
								fontSize={'sm'}
								fontFamily="Poppins"
								className="borrow_table_Head">
								Liquidity
							</Th> */}
							<Th
								fontSize={'xs'}
								fontFamily="Poppins"
								id="borrow_table_HeadingRightBorderRadius"
								className="borrow_table_Head"></Th>
						</Tr>
					</Thead>
					<Tbody>
						{debts.map((debt: any) => {
							return (
								<Tr key={debt['symbol']}  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
									<Td
										>
										<Box
											display="flex"
											alignItems="center"
											cursor="pointer">
											<Image src={`/${debt.symbol}.png`} 
                                            width={"35px"} height={35} 
                                            style={tknholdingImg} alt="..." />
											<Box ml={2}>
												<Text
													fontSize="sm"
													fontWeight="bold"
													textAlign={'left'}>
													{debt['name'].split(" ").slice(1).join(" ")}
												</Text>
												<Text
													fontSize="xs"
													fontWeight="light"
													textAlign={'left'}>
													{debt['symbol']}
												</Text>
											</Box>
										</Box>
									</Td>
									<Td>
										${' '}{(debt['price']*1).toFixed(2)}
									</Td>
									<Td>
										<Box>
											<Text
												fontSize="sm"
												fontWeight="bold"
												textAlign={'left'}>
												{(debt['amount'][0]/1e18).toFixed(4)}{' '}
												{debt['symbol']}
											</Text>
											{/* <Text
												fontSize="xs"
												fontWeight="light"
												textAlign={'left'}>
												{debt['walletBalance']}{' '}
												{debt['asset']['symbol']}
											</Text> */}
										</Box>
									</Td>
									{/* <Td className="borrow_table_data">
										{debt['asset'][
											'totalLiquidity'
										].toString()}{' '}
										{debt['asset']['symbol']}
									</Td> */}
									<Td>
										<Flex alignItems={'center'}>
											<IssueModel asset={debt} minCRatio={minCRatio} collateralBalance={collateralBalance} cRatio={cRatio} />
											<RepayModel asset={debt} balance={debt['walletBalance']/1e18} />
										</Flex>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
};

export default IssuanceTable;