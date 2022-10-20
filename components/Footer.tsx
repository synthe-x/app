import { Text, Box, Flex, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Footer(){

    // const router = useRouter();
    
    return (
        <>

        <Flex
        position={'fixed'}
        bottom={0}
        mt={10}
        height={8}
        width={"100%"}
        // bgColor="#fff"
        textAlign={"center"}
        justify="space-between"
        align={"center"}
        wrap="wrap"
        // px={5}
        // maxW={"1200px"}
        // mx="100px"
        >
            {/* <Divider/>

            <Flex gap={2} justify="space-between">

            <Text fontSize={"sm"}>ChainScore Limited</Text>
            <Text fontSize={"sm"}>hello@chainscore.finance</Text>
            </Flex>

            <Text fontSize={"sm"}>Build on Tron</Text> */}


        </Flex>
        </>
    )
}