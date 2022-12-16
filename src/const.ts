import { ethers } from "ethers";
import { ChainID } from "./chains";
export const DUMMY_ADDRESS = {
	[ChainID.NILE]: "TU6nPbkDzMfhtg13nUnTMbuVFFMpLSs3P3",
	[ChainID.AURORA]: ethers.constants.AddressZero,
};

export const HELPER = "";
export const EXCHANGE = "";
export const VAULT = "";
export const SYSTEM = "";

export const ADDRESSES: any = {
	[ChainID.NILE]: {
		Helper: "TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE",
		System: "TJiPUzzt3yQySg8qJ6xPXpuPn1yHjHNJxm",
		WTRX: "TJE8C3ZhnxrQAL69D5C6C5fQFNitrTKqZD",
	},
	[ChainID.AURORA]: {
		Helper: "0x36A0A236C0125240cB15629959bdFf74fC1F3290",
		System: "0xFac2F4ce393Bc7253d3795D6f415d792ee4eca3A",
		WTRX: "0x6CF5B73CC04D54418686dc9FE389fc7b90ad0e89",
	},
	[ChainID.ARB_GOERLI]: {
		SyntheX: "0xF5B32d7a0809BBB830F584CCfa8391ecA232Ffc2",
		Multicall: "0x511f64296fa72526231E5A55615d8e4eE5a2d4cF",
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: "https://api.synthex.finance/",
	[ChainID.AURORA]: "https://aurora.api.synthex.finance/", // 'http://localhost:3030/',
	[ChainID.ARB_GOERLI]:
		"https://api.thegraph.com/subgraphs/name/prasad-kumkar/synthex",
};

export const dollarFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumSignificantDigits: 8,
});

export const tokenFormatter = new Intl.NumberFormat("en-US", {
	maximumSignificantDigits: 8,
});

export const TOKEN_COLORS: any = {
	'USDCx': '#1c1c1c',
	'BTCx': 'orange.600',
	'ETHx': 'purple.700',
	'LINKx': 'green',
	'UNIx': 'yellow',
	'YFIx': 'red',
	'WBTCx': 'pink',
	'AAVEx': 'gray',
	'COMPx': 'teal',
	'TSLAx': 'red.700',
	'^GSPCx': 'red.600',
	'AMZNx': 'orange',
	'GOOGx': 'gray',
	'NFLXx': 'indigo',
	'FBx': 'violet',
	'BNBx': 'green',
	'ADAx': 'blue',
	'DOGEx': 'blue',
	'XRPx': 'gray',
	'DOTx': 'gray',
	'LTCx': 'gray',
	'USDx': 'blue.500',
	'YENx': 'green.500',
	'EURx': 'purple.500',
	'GBPx': 'yellow.500',
	'CHFx': 'red.500',
	'CADx': 'pink.500',
	'AUDx': 'gray.500',
	'NZDx': 'teal.500',
	'JPYx': 'red.400',
	'WONx': 'orange.500',
	'INRx': 'orange.500',
}