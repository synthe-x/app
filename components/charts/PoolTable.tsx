import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { WalletContext } from '../../components/WalletContextProvider';
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
	Image,
} from '@chakra-ui/react';
import Bar from '../../components/charts/Bar';
import EnterPool from '../../components/EnterPool';
import ExitPool from '../../components/ExitPool';

import { MdArrowBackIos } from 'react-icons/md';
import { useEffect } from 'react';

import React from 'react';
import PoolPie from '../../components/charts/PoolPie';
import axios from 'axios';

const dollarFormatter = (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));
const tokenFormatter = (new Intl.NumberFormat('en-US'));

export default function PoolTable({pool}: any) {
  return (
    <>
        {pool && pool.poolSynth_ids? <TableContainer
							width={'40%'}
							border={'1px solid #2C2C2C'}
							rounded={6}
							py={2}
							bgColor="#171717"
							minH="700px">
							<Table variant="simple" size={'sm'}>
								<Thead>
									<Tr>
										<Th>Asset</Th>
										<Th>Liquidity</Th>
										<Th>Price</Th>
									</Tr>
								</Thead>
								<Tbody>
									{pool.poolSynth_ids.map(
										(synth: any, index: number) => {
											return (
												<Tr key={index}>
													<Td
														display="flex"
														alignItems={'center'}>
														<Image
															src={`/${synth?.symbol}.png`}
															width="25"
															height={25}
															alt="logo"
															mr={2}
														/>
														{synth?.name
															.split(' ')
															.slice(1)
															.join(' ')}
													</Td>
													<Td>
														{tokenFormatter.format(
															synth?.balance /
																10 **
																	(synth?.decimal ??
																		18)
														)}{' '}
														{synth?.symbol}
													</Td>
													<Td>
														{dollarFormatter.format(
															synth?.price
														)}
													</Td>
												</Tr>
											);
										}
									)}
								</Tbody>
							</Table>
						</TableContainer>: <>Loading</>}
    </>
  )
}
