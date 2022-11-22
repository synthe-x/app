import { ethers } from 'ethers';
import { ChainID } from './chains';
export const DUMMY_ADDRESS = {
	[ChainID.NILE]: 'TU6nPbkDzMfhtg13nUnTMbuVFFMpLSs3P3',
	[ChainID.AURORA]: ethers.constants.AddressZero,
};

export const HELPER = '';
export const EXCHANGE = '';
export const VAULT = '';
export const SYSTEM = '';

export const ADDRESSES: any = {
	[ChainID.NILE]: {
		Helper: 'TY7KLZkopABnjy4x8SSbsaK9viV9bqxCvE',
		System: 'TJiPUzzt3yQySg8qJ6xPXpuPn1yHjHNJxm',
		WTRX: 'TJE8C3ZhnxrQAL69D5C6C5fQFNitrTKqZD'
	},
    [ChainID.AURORA]: {
		Helper: '0x36A0A236C0125240cB15629959bdFf74fC1F3290',
		System: '0x3c60B853a0F4df71976980A5A4209e0C63D7c465',
		WTRX: '0x09ad555C5BE860ed43D24d22b3223bAcD0bE60e6'
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: 'https://api.synthex.finance/',
	[ChainID.AURORA]: 'https://aurora.api.synthex.finance/',
};
