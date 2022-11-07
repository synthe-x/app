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
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import PoolCardAssets from './PoolCardAssets';
import { AppDataContext } from './AppDataProvider';

function PoolCard({ pool }: any) {
	const {
		dollarFormatter
	} = useContext(AppDataContext);

	const [totalLiquidity, setTotalLiquidity] = useState(0);
	useEffect(() => {
		let _totalLiquidity = 0;
		for(let i in pool.poolSynth_ids){
			console.log(pool.poolSynth_ids[i].balance, pool.poolSynth_ids[i].price)
			_totalLiquidity += pool.poolSynth_ids[i].balance * pool.poolSynth_ids[i].price / 10**18;
		}
		setTotalLiquidity(_totalLiquidity)
	}, [pool.poolSynth_ids])

	return (
		<>
        <LinkBox>
			<Flex
			justify={'space-between'}
			flexDirection={'column'}
				width={'100%'}
				height={'241px'}
				style={{
					background: 'url(/bgpool1.png) padding-box, linear-gradient(to right, #FFFFFF, #1c1c1c, #FFFFFF) border-box',
					borderRadius: '30px',
					border: '1px solid transparent'
				}}
                onClick={()=>{}}
				bgSize={'1327px 241px'}
				px='30px'
				py='20px'
				color={'#fff'}
                >
					
				<Flex justify={'space-between'}>

					<Flex align={"center"} gap={2}>
                        <Text fontSize={'2xl'} fontWeight="bold">
							<LinkOverlay href={"/pool/"+pool.pool_address}>
								{pool.name}
							</LinkOverlay>
                        </Text>
						<Text my={2} >({pool.symbol})</Text>
					</Flex>
                    <Box textAlign={"right"}>
						<Text fontWeight={"bold"} color="gray" fontSize={"sm"}>LIQUIDITY</Text>
                        <Heading size={'md'} fontWeight={'bold'}>{dollarFormatter.format(totalLiquidity)}</Heading>
                    </Box>
				</Flex>
					
					<PoolCardAssets assets={pool.poolSynth_ids}/>

			</Flex>
            </LinkBox>
		</>
	);
}

export default PoolCard;
