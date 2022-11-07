import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
	RainbowKitProvider,
	getDefaultWallets,
	darkTheme,
} from '@rainbow-me/rainbowkit';
import {
	chain,
	configureChains,
	createClient,
	WagmiConfig,
	defaultChains,
} from 'wagmi';
import { chains } from '../src/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { WalletContextProvider } from '../components/WalletContextProvider';
import Index from './_index';

const config: ThemeConfig = {
	initialColorMode: 'light',
	useSystemColorMode: true,
};

import { useEffect } from 'react';
import { AppDataProvider } from '../components/AppDataProvider';

const { provider, webSocketProvider } = configureChains(chains, [
	publicProvider(),
]);

const client = createClient({
	provider,
	webSocketProvider,
});

const breakpoints = {
	sm: '360px',
	md: '768px',
	lg: '1024px',
	xl: '1440px',
	'2xl': '1680px',
};
const theme = extendTheme({
	//components,
	// styles,
	config,
	breakpoints,
	colors: {
		primary: '#3EE6C4',
		secondary: '#5677FB'
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		localStorage.setItem('chakra-ui-color-mode', 'light');
	});

	return (
		<ChakraProvider theme={theme}>
			<WagmiConfig client={client}>
				<WalletContextProvider>
					<AppDataProvider>
						<Index>
							<Component {...pageProps} />
						</Index>
					</AppDataProvider>
				</WalletContextProvider>
			</WagmiConfig>
		</ChakraProvider>
	);
}

export default MyApp;
