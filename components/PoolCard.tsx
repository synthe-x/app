import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Wrap,
	WrapItem,
	Avatar,
	Heading,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../components/WalletContextProvider';
import { LinkBox, LinkOverlay } from '@chakra-ui/react';
import PoolCardAssets from './PoolCardAssets';
import { AppDataContext } from './AppDataProvider';
import Link from 'next/link';

function PoolCard({ pool }: any) {
	const { dollarFormatter } = useContext(AppDataContext);

	const [totalLiquidity, setTotalLiquidity] = useState(0);
	useEffect(() => {
		let _totalLiquidity = 0;
		for (let i in pool.poolSynth_ids) {
			console.log(
				pool.poolSynth_ids[i].balance,
				pool.poolSynth_ids[i].price
			);
			_totalLiquidity +=
				(pool.poolSynth_ids[i].balance * pool.poolSynth_ids[i].price) /
				10 ** 18;
		}
		setTotalLiquidity(_totalLiquidity);
	}, [pool.poolSynth_ids]);

	return (
		<Link
			href={'/pool/' + pool.pool_address}
			as={'/pool/' + pool.pool_address}>
			<a>
				<Flex
					justify={'space-between'}
					flexDirection={'column'}
					width={'100%'}
					height={'220px'}
					style={{
						background:
							'linear-gradient(to right, rgba(255,255,255,0.1), rgba(0,0,0,0)), url(/bgpool1.png) padding-box, linear-gradient(to right, #D9D9D9, #1c1c1c, #D9D9D9) border-box',
						borderRadius: '14px',
						border: '1px solid transparent',
					}}
					
					bgColor="black"
					onClick={() => {}}
					bgSize={'1327px 241px'}
					px="22px"
					py="20px"
					color={'#fff'}>
					<Flex justify={'space-between'}>
						<Flex align={'center'} gap={2}>
							<Text fontSize={'2xl'} fontWeight="bold">
								{pool.name}
							</Text>
							<Text my={2}>({pool.symbol})</Text>
						</Flex>
						<Box textAlign={'right'}>
							<Text
								fontWeight={'bold'}
								color="gray"
								fontSize={'sm'}>
								LIQUIDITY
							</Text>
							<Heading size={'md'} fontWeight={'bold'}>
								{dollarFormatter.format(totalLiquidity)}
							</Heading>
						</Box>
					</Flex>

					<PoolCardAssets assets={pool.poolSynth_ids} />
				</Flex>
			</a>
		</Link>
	);
}

export default PoolCard;
