import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import DonutChart from './DonutChart';

export default function Chart() {
  return (
    <Flex
    flexDir={'column'}
    bgColor={'#5677FB'}
    height='100%'
    rounded={15}
    justify='center'
    py='22px'
    px={'20px'}
    >
      <Flex height={'80%'} align='center' pt={5} justify={'center'} width='100%'>
        <DonutChart />
      </Flex>
      <Flex textAlign={'right'} height={'20%'} align='end' justify={'end'} gap={1}>
        <Box>
        <Text fontSize={'sm'}>Stability Rate</Text>
				<Text fontSize={'xl'} fontWeight="bold">
					1.01%
				</Text>
        </Box>
      </Flex>
    </Flex>
  )
}
