import { Chain } from "wagmi";

const aurora: Chain = {
		/** ID in number form */
		id: 1313161555,
		/** Human-readable name */
		name: 'Aurora Testnet',
		/** Internal network name */
		network: 'Aurora',
		/** Currency used by chain */
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		/** Collection of RPC endpoints */
		rpcUrls: {
			public: 'https://testnet.aurora.dev',
			default: 'https://testnet.aurora.dev',
		},
		/** Collection of block explorers */
		blockExplorers: {
			etherscan: {
				name: 'AuroraScan',
				url: 'https://testnet.aurorascan.dev/',
			},
			default: {
				name: 'AuroraScan',
				url: 'https://testnet.aurorascan.dev/',
			},
		},

		/**
		 * Chain [multicall3 contract](https://github.com/mds1/multicall)
		 */
		// multicall?: {
		//     address: Address;
		//     blockCreated: number;
		// };
		/** Flag for test networks */
		// testnet: true,
	};

export const chains: Chain[] = [aurora];
