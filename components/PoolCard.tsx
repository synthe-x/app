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
	const { colorMode } = useColorMode();

	const {
		dollarFormatter
	} = useContext(AppDataContext);

	const [totalLiquidity, setTotalLiquidity] = useState(0);
	useEffect(() => {
		let _totalLiquidity = 0;
		for(let i in pool.poolSynth_ids){
			_totalLiquidity += pool.poolSynth_ids[i].balance * pool.poolSynth_ids[i].synth_id.price / 10**18;
		}
		setTotalLiquidity(_totalLiquidity)
	}, [pool.poolSynth_ids])

	return (
		<>
        <LinkBox>
			<Box
				width={'100%'}
				bgColor="white"
				height={'250px'}
				rounded={20}
				border="1px"
				borderColor="white"
                onClick={()=>{}}
                // border="1px solid #2D2D2D"
                >
					<Flex height={"75%"} 
					bgColor="black" 
					p={5} borderRadius={'19px 19px 0 0'} justify="end" flexDirection={"column"}
					bgImage={"./cover.png"}
					>
						<PoolCardAssets assets={pool.poolSynth_ids}/>
					</Flex>

				<Flex justify={'space-between'} px={5} mt={2}>
					<Flex align={"center"} gap={2}>
                        <Text fontSize={'2xl'} fontWeight="bold">
							<LinkOverlay href={"/pool/"+pool.id}>
								{pool.name}
							</LinkOverlay>
                        </Text>
						<Text my={2} >({pool.symbol})</Text>
					</Flex>
                    <Box textAlign={"right"}>
						<Text fontWeight={"bold"} color="gray" fontSize={"sm"}>LIQUIDITY</Text>
                        <Heading size={'md'} fontWeight={'bold'} color="black">{dollarFormatter.format(totalLiquidity)}</Heading>
                    </Box>

                </Flex>
			</Box>
            </LinkBox>
		</>
	);
}

export default PoolCard;
