import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { WalletContext } from '../components/WalletContextProvider';
import {useEffect} from 'react';
import { id } from 'ethers/lib/utils';

export default function _index({ Component, pageProps }: any) {

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

    useEffect(() => {
        if(typeof window !== 'undefined'){
            if(!isFetchingData && !isDataReady) fetchData((window as any).tronWeb);
        }
    }, [fetchData, isFetchingData, isDataReady])

	return (
		<Box>
           {connectionError && <Text textAlign={"center"} width="100%" fontSize={"lg"}  p={2} bgColor="gray.800">{connectionError}</Text>}
           {isFetchingData ? <Progress isIndeterminate/>: 
           
            <Flex
                justify={'center'}
                flexDirection={{ sm: 'column', md: 'row' }}>
                <Box maxWidth={'1300px'} minW={'1200px'}>
                    <Navbar />
                    <Component {...pageProps} />
                </Box>
            </Flex>
           }
           {/* {!isConnected ?? <>
            <Flex justify={"center"}>
				<Box width="400px" height={200} textAlign={"center"} p={5} rounded={10}>
				<Text fontSize={"md"} mb={5}>Please connect your wallet to continue</Text>
				</Box>
				</Flex>
            <Text textAlign={"center"} width="100%" fontSize={"lg"}  p={2} bgColor="gray.800">Please connect your TronLink wallet</Text>
           </>} */}
			<Footer />
		</Box>
	);
}
