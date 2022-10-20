import { Avatar, Box, Flex, Image, Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';

let dummyAssets = ['1DAI', '1ETH', '1WBTC', '1USDC', '1USDT'];
let dummyValues = ['100', '120', '50', '30', '75'];

export default function PoolCardAssets({
	assets = dummyAssets,
}: any) {
	return (
		<>
			<Flex>
				{assets.map((asset: any, index: number) => {
					return (
						<>
							<Box key={index}>
									<Image
										width={'50px'}
                                        mr="3"
										alt="logo"
										src={`/${asset.symbol}.png`}
									/>
							</Box>
						</>
					);
				})}
                </Flex>
                {/* <Flex mt={-8}>

				{assets.map((asset, index) => {
					return (
						<>
							<Box
								width={`${
									(100 * Number(values[index])) / total
								}%`}
								height="5px"
								bgGradient="linear(to-r, gray.800, yellow.400, pink.200)"
								rounded={10}></Box>
						</>
					);
				})}
                </Flex> */}
			
		</>
	);
}
