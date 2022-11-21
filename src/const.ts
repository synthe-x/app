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
		System: '0x240B793b7eE70467ed29124399cc17B01932Ca18',
		WTRX: '0x66E4B74d3d5f8435A62ae7Ed343068fE99698f11'
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: 'https://api.synthex.finance/',
	[ChainID.AURORA]: 'https://aurora.api.synthex.finance/',
};
