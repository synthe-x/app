import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { WalletContext } from '../components/WalletContextProvider';
import {useEffect} from 'react';
import { id } from 'ethers/lib/utils';
import { useRouter } from "next/router";

export default function _index({children}: any) {
    const {
		isConnected,
		isConnecting,
		address,
		connect,
		collaterals,
		synths,
		totalCollateral,
		totalDebt,
		isDataReady,
		connectionError,
		availableToBorrow,
        fetchData,
        isFetchingData
	} = useContext(WalletContext);

    const router = useRouter();
    
    const backgroundStyle = {
        backgroundColor: "#000",
        backgroundRepeat: "no-repeat",
        height: (router.pathname === '/' || router.pathname.includes("pool/")) ? "420px" : "100%",
        backgroundSize: "contain",
        backgroundPosition: "top",
        minW: "100%",
    }

	return (
		<Box>
           {connectionError && <Text textAlign={"center"} width="100%" fontSize={"md"} fontWeight="bold" p={2} bgColor="gray.50">{connectionError}</Text>}
            <Box {...backgroundStyle} >
            <Flex
                justify={'center'}
                flexDirection={{ sm: 'column', md: 'row' }}
                minH="100vh"
                >
                <Box maxWidth={'1300px'} minW={'1200px'}>
                    <Navbar />
                    {children}
                </Box>
            </Flex>
            <Footer />
            </Box>
           
		</Box>
	);
}
