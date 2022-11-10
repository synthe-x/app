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

const dollarFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});
const tokenFormatter = new Intl.NumberFormat('en-US');

export default function PoolTable({ pool }: any) {
	return (
		<>
			{pool && pool.poolSynth_ids ? (
				<TableContainer
					rounded={10}
					py={4}
					px={4}
					bgColor="#171717"
					color={'white'}
					minH="700px">
					<Table variant="simple" size={'sm'}>
						<Thead>
							<Tr>
								<Th borderColor={'#3C3C3C'}>Asset</Th>
								<Th borderColor={'#3C3C3C'}>Liquidity</Th>
								<Th borderColor={'#3C3C3C'}>Price</Th>
							</Tr>
						</Thead>
						<Tbody>
							{pool.poolSynth_ids.map(
								(synth: any, index: number) => {
									return (
										<Tr key={index}>
											<Td
											borderColor={'#3C3C3C'}
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
											<Td borderColor={'#3C3C3C'}>
												{tokenFormatter.format(
													synth?.balance /
														10 **
															(synth?.decimal ??
																18)
												)}{' '}
												{synth?.symbol}
											</Td>
											<Td borderColor={'#3C3C3C'}>
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
				</TableContainer>
			) : (
				<>Loading</>
			)}
		</>
	);
}
