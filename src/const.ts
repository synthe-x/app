import { ChainID } from './chains';
export const DUMMY_ADDRESS = 'TU6nPbkDzMfhtg13nUnTMbuVFFMpLSs3P3';
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
		Helper: '0x93cC35C57457ac13BD0168a57b7EdB767c5f01d3',
		System: '0x24dBDE5702bf83F8B7A7BF991FEAf311d1FD9eb0',
		WTRX: '0xB5Cd98a00f3F1B580699865b6A72FebdC91588F7'
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: 'https://api.synthex.finance/',
	[ChainID.AURORA]: 'https://aurora.api.synthex.finance/',
};
