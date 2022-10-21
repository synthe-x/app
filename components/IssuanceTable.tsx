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

const IssuanceTable = ({handleChange}: any) => {
	const [nullValue, setNullValue] = useState(false);
	const { currentPage, setCurrentPage, pagesCount, pages, pageSize } =
		usePagination({
			pagesCount: 2,
			initialState: { currentPage: 1 },
		});


	const {
		synths: debts,
		isConnected,
		tokenFormatter,
		dollarFormatter,
		isDataReady,
		updateSynthWalletBalance, updateSynthAmount
	} = useContext(WalletContext);

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
				<Table overflow={'auto'} variant="simple">
					<Thead>
						<Tr>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'}>
								Issuance Assets
							</Th>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'}>
								Protocol Debt
							</Th>
							<Th fontSize={'xs'} fontFamily="Poppins" color={'gray.500'}>
								Liquidity
							</Th>

							<Th
								isNumeric
								fontSize={'xs'}
								fontFamily="Poppins"
								color={'gray.500'}
								></Th>
						</Tr>
					</Thead>
					<Tbody>
						{debts
							.slice((currentPage - 1) * 8, currentPage * 8)
							.map((debt: any) => {
								return (
									<Tr key={debt['symbol']}>
										<Td minW={'190px'}>
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

										<Td maxW={'110px'}>
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
										<Td>
											<Text fontSize={'sm'}>
												{dollarFormatter.format(
													((debt.totalBorrowed ??
														0) * debt.price) / 1e18
												)}
											</Text>
										</Td>
										<Td isNumeric maxW={'110px'}>
											<Flex alignItems={'center'}>
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
