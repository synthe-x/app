import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets, darkTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { WalletContextProvider } from '../components/WalletContextProvider';
import Index from "./_index"

const config: ThemeConfig = {
  initialColorMode: 'dark',
}

import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

const styles = {
  global: (props: Record<string, any>) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('white', '#000')(props),
      margin: 0,
      padding: 0,
    },
  }),
};

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: (props: StyleFunctionProps | Record<string, any>) => ({
      dialog: {
        bg: mode('white', '#141214')(props),
      },
    }),
  },
};


const breakpoints ={
  sm: "360px",
  md: "768px",
  lg: "1024px",
  xl: "1440px",
  "2xl": "1680px"
};
const theme = extendTheme({ components, styles, config,breakpoints })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
    <WalletContextProvider>
        <Index>
          <Component {...pageProps} />
        </Index>
    </WalletContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
