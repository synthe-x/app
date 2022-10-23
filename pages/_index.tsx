import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { WalletContext } from '../components/WalletContextProvider';
import { useEffect } from 'react';
import { id } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { AppDataContext } from '../components/AppDataProvider';
import { useState } from 'react';

export default function _index({ children }: any) {

	const {
		isConnected,
		isConnecting,
		address,
		tronWeb,
		connect,
		connectionError,
	} = useContext(WalletContext);

	const {
		collaterals,
		synths,
		totalCollateral,
		totalDebt,
		isDataReady,
		availableToBorrow,
		fetchData,
		isFetchingData,
	} = useContext(AppDataContext);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (localStorage.getItem('address') && !isConnected && !isConnecting) {
				connect((_address: string|null, _err: string) => {
					if(!isDataReady && !isFetchingData && _address) {
                        fetchData(tronWeb, _address)
                    }
				});
			}
		}
	});

	const router = useRouter();

	const backgroundStyle = {
		backgroundColor: '#000',
		backgroundRepeat: 'no-repeat',
		height:
			router.pathname === '/' || router.pathname.includes('pool/')
				? {sm: '100%', md: '480px'}
				: '100%',
		backgroundSize: 'contain',
		backgroundPosition: 'top',
		// minW: '100%',
	};

	return (
		<Box>
			{connectionError && (
				<Text
					textAlign={'center'}
					width="100%"
					fontSize={'md'}
					fontWeight="bold"
					p={2}
					bgColor="gray.50">
					{connectionError}
				</Text>
			)}
			<Box {...backgroundStyle}>
				<Flex
					justify={'center'}
					flexDirection={{ sm: 'column', md: 'row' }}
					minH="100vh">
					<Box maxWidth={'1300px'} 
                    minW={{sm: '0', md: '0', lg: '1200px'}}
                    >
						<Navbar />
						{children}
					</Box>
				</Flex>
				<Footer />
			</Box>
		</Box>
	);
}
