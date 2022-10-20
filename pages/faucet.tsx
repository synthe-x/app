import { Box, Flex, Heading, Image } from '@chakra-ui/react'
import React from 'react'

export default function faucet() {
  return (
    <Flex color={"white"} justify="center" height={"85vh"}>
        <Flex flexDir={"column"} justify="center" height={"200px"} width="200px" bgColor={"#C53027"} rounded={20}>
            <Image src="/WTRX.png" width={20} height={20} alt="WTRX"/>
            <Heading size={"md"}>
                WTRX Faucet
            </Heading>
        </Flex>
    </Flex>
  )
}
