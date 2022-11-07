import React, { useContext, useState } from 'react';
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
	useDisclosure,
	useColorMode,
	Skeleton,
} from '@chakra-ui/react';

import Image from 'next/image';
import IssueModel from './modals/IssueModal';
import RepayModel from './modals/RepayModal';
import { WalletContext } from './WalletContextProvider';
import {
	MdArrowBackIos,
	MdNavigateBefore,
	MdNavigateNext,
} from 'react-icons/md';

import {
	Pagination,
	usePagination,
	PaginationNext,
	PaginationPage,
	PaginationPrevious,
	PaginationContainer,
	PaginationPageGroup,
} from '@ajna/pagination';
import { AppDataContext } from './AppDataProvider';

const IssuanceTable = ({handleChange}: any) => {
	const [nullValue, setNullValue] = useState(false);
	const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
		usePagination({
			pagesCount: 2,
			initialState: { currentPage: 1 },
		});
	
	const {
		isConnected,
	} = useContext(WalletContext);

	const {
		synths: debts,
		tokenFormatter,
		dollarFormatter,
		isDataReady,
		updateSynthWalletBalance, updateSynthAmount
	} = useContext(AppDataContext);

	const handleIssue = (synthId: string, value: string) => {
		updateSynthWalletBalance(synthId, value, true)
		updateSynthAmount(synthId, 0, value, false)
		setNullValue(!nullValue)
		handleChange()
	}

	const handleRepay = (synthId: string, value: string) => {
		updateSynthWalletBalance(synthId, value, false)
		updateSynthAmount(synthId, 0, value, true)
		setNullValue(!nullValue)
		handleChange()
	}

	return (
		<Skeleton isLoaded={debts.length > 0}>
			<TableContainer>
				<Table overflow={'auto'} variant="simple" >
					<Thead>
						<Tr>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'} borderColor={'#3C3C3C'}>
								Issuance Assets
							</Th>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'} borderColor={'#3C3C3C'}>
								Protocol Debt
							</Th>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'} borderColor={'#3C3C3C'}>
								Liquidity
							</Th>
							<Th
							borderColor={'#3C3C3C'}
								isNumeric
								fontSize={'xs'}
								fontFamily="Poppins"
								color={'gray.500'}
							></Th>
						</Tr>
					</Thead>
					<Tbody >
						{debts
							.slice((currentPage - 1) * 8, currentPage * 8)
							.map((debt: any) => {
								return (
									<Tr key={debt['symbol']} >
										<Td minW={'190px'} borderColor={'#3C3C3C'}>
											<Flex align={'center'} gap={2}>
												<Image
													src={`/${debt.symbol}.png`}
													width={35}
													height={35}
													// style={tknholdingImg}
													alt="..."
												/>
												<Box>
													<Text
														fontSize="sm"
														fontWeight="bold"
														textAlign={'left'}>
														{debt['name']
															.split(' ')
															.slice(1)
															.join(' ')}
													</Text>
													<Text
														fontSize="xs"
														fontWeight="light"
														textAlign={'left'}>
														{debt['symbol']}
													</Text>
												</Box>
											</Flex>
										</Td>

										<Td maxW={'110px'} borderColor={'#3C3C3C'}>
											<Box>
												<Text
													fontSize="sm"
													// fontWeight="bold"
													textAlign={'left'}>
													{isConnected
														? tokenFormatter.format(
																debt.amount[0] / 1e18
														  )
														: '-'}{' '}
													{debt['symbol']}
												</Text>
												<Text
													fontSize="xs"
													// fontWeight="bold"
													textAlign={'left'}>
													{isConnected
														? dollarFormatter.format(
																(debt.amount[0] * debt.price) /
																	1e18
														  )
														: '-'}{' '}
												</Text>
											</Box>
										</Td>
										<Td borderColor={'#3C3C3C'}>
											<Text fontSize={'sm'}>
												{dollarFormatter.format(
													((debt.liquidity ??
														0) * debt.price) / 1e18
												)}
											</Text>
										</Td>
										<Td isNumeric maxW={'110px'} borderColor={'#3C3C3C'}>
											<Flex alignItems={'end'} justify='end' gap={2}>
												<IssueModel asset={debt} handleIssue={handleIssue} />
												<RepayModel asset={debt} handleRepay={handleRepay} />
											</Flex>
										</Td>
									</Tr>
								);
							})}
					</Tbody>
				</Table>
			</TableContainer>

			<Flex justify={'center'}>
				<Pagination
					pagesCount={pagesCount}
					currentPage={currentPage}
					onPageChange={setCurrentPage}>
					<PaginationContainer my={4}>
						<PaginationPrevious variant={'none'}>
							<MdNavigateBefore />
						</PaginationPrevious>
						<PaginationPageGroup>
							{pages.map((page: number) => (
								<PaginationPage
									key={`pagination_page_${page}`}
									page={page}
									width={10}
									rounded={'full'}
									bgColor={page === currentPage ? 'black' : '#171717'}
									_hover={{bgColor: 'gray.700'}}
								/>
							))}
						</PaginationPageGroup>
						<PaginationNext variant={'none'}>
							{' '}
							<MdNavigateNext />{' '}
						</PaginationNext>
					</PaginationContainer>
				</Pagination>
			</Flex>
		</Skeleton>
	);
};

export default IssuanceTable;
