import * as React from 'react';
const { Big } = require('big.js');

const WalletContext = React.createContext<WalletValue>({} as WalletValue);

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const node = 'https://nile.trongrid.io';
const fullNode = new HttpProvider(node);
const solidityNode = new HttpProvider(node);
const eventServer = new HttpProvider(node);
const privateKey =
	'52641f54dc5e1951657523c8e7a1c44ac76229a4b14db076dce6a6ce9ae9293d';
const tronWebObject = new TronWeb(
	fullNode,
	solidityNode,
	eventServer,
	privateKey
);

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Web3 from 'web3';
import { ChainID } from '../src/chains';

function WalletContextProvider({ children }: any) {
	const [address, setAddress] = React.useState<string | null>(null);
	const [tronWeb, setTronWeb] = React.useState({});
	const [isConnected, setIsConnected] = React.useState(false);
	const [isConnecting, setIsConnecting] = React.useState(false);
	const [isDisconnected, setIsDisconnected] = React.useState(true);
	const [connectionError, setConnectionError] = React.useState<null | string>(
		null
	);
	const [chain, setChain] = React.useState(0);

    const {address: addressWagmi, connector: activeConnector} = useAccount()
	const { connectAsync: connectWagmi, connectors: wagmiConnectors } = useConnect();
	const { disconnect: disconnectWagmi } = useDisconnect();

	const connect = (
		chain: ChainID,
		callback: (address: string | null, err: string | null) => void = (
			__: string | null,
			_: string | null
		) => {},
		options: { errRetryCount: number } = { errRetryCount: 0 }
	) => {
        console.log('connecting to',chain, '// retry count', options.errRetryCount);
        if (isConnected || isConnecting) return;
		setIsConnecting(true);
		if (chain != ChainID.NILE) {
            if(activeConnector) return
			connectWagmi({
				chainId: chain,
				connector: wagmiConnectors[0],
			}).then((resp) => {
                const web3 = new Web3((window as any).web3.currentProvider.enable());
                setTronWeb(web3);
				setAddress(resp.account);
                setIsConnected(true);
                setIsConnecting(false);
                setChain(chain);
                callback(resp.account, null);
                setIsDisconnected(false);
                localStorage.setItem('address', resp.account);
                localStorage.setItem('chain', chain.toString())
			})
            .catch((err) => {
                console.log("Error connecting wagmi", err)
            })
		} else {
			if ((window as any).tronWeb) {
				setTronWeb((window as any).tronWeb);
				(window as any).tronWeb.trx
					.getAccount((window as any).tronWeb.defaultAddress.base58)
					.then((account: any) => {
						let _addr = '';
						if (!account.address) {
							_addr = (window as any).tronWeb.address.fromHex(
								account.__payload__.address
							);
						} else {
							_addr = (window as any).tronWeb.address.fromHex(
								account.address
							);
						}
						if (
							(window as any).tronWeb.fullNode.host !=
							'https://api.nileex.io'
						) {
							setConnectionError(
								'Please connect to Nile Testnet'
							);
							callback(
								null,
								'ERROR: Not connected to Nile Testnet'
							);
						}
						setAddress(_addr);
						setChain(chain);
						callback(_addr, null);
						setIsConnected(true);
						setIsDisconnected(false);
						setIsConnecting(false);
						localStorage.setItem('address', _addr);
                        localStorage.setItem('chain', chain.toString())
					})
					.catch((err: any) => {
						if (options.errRetryCount >= 5) {
							setConnectionError(
								'Unlock your TronLink wallet to connect'
							);
							setIsConnecting(false);
							let __tronWeb = (window as any).tronWeb;
							if (!__tronWeb) {
								setTronWeb(tronWebObject);
							}
							callback(null, 'ERROR: TronLink wallet is locked');
						} else {
							setTimeout(() => {
								connect(chain, callback, {
									errRetryCount: options.errRetryCount + 1,
								});
							}, 1000);
						}
					});
			} else {
				if (typeof window !== 'undefined') {
					if (options.errRetryCount >= 5) {
						setConnectionError(
							'Please install TronLink wallet extension'
						);
						setIsConnecting(false);
						let __tronWeb = (window as any).tronWeb;
						if (!__tronWeb) {
							setTronWeb(tronWebObject);
						}
						callback(
							null,
							'ERROR: TronLink wallet is not installed'
						);
					} else {
						setTimeout(() => {
							connect(chain, callback, {
								errRetryCount: options.errRetryCount + 1,
							});
						}, 1000);
					}
				}
			}
		}
	};

	const disconnect = () => {
		setAddress(null);
		setConnectionError('');
		setChain(0);
		setIsConnected(false);
		setIsConnecting(false);
		localStorage.removeItem('address');
		localStorage.removeItem('chain');
	};

	const value: WalletValue = {
		address,
		tronWeb,
		isConnected,
		isConnecting,
		isDisconnected,
		chain,
		connect,
		connectionError,
		disconnect,
	};

	return (
		<WalletContext.Provider value={value}>
			{children}
		</WalletContext.Provider>
	);
}

interface WalletValue {
	address: string | null;
	tronWeb: {};
	isConnected: boolean;
	isConnecting: boolean;
	isDisconnected: boolean;
	chain: number;
	connect: (callback: any, options?: any) => void;
	disconnect: () => void;
	connectionError: string | null;
}

export { WalletContextProvider, WalletContext };
