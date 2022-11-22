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
		System: '0xFac2F4ce393Bc7253d3795D6f415d792ee4eca3A',
		WTRX: '0x6CF5B73CC04D54418686dc9FE389fc7b90ad0e89'
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: 'https://api.synthex.finance/',
	[ChainID.AURORA]:  'https://aurora.api.synthex.finance/', // 'http://localhost:3030/' 
};
