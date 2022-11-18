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
		System: '0x8Db9C36E8ef7d7C397c56A7a1f7833fFEe7b7865',
		WTRX: '0x4397CBc22246933c07F04bc3A7fDF12619D90af6'
	},
};

export const Endpoints: any = {
	[ChainID.NILE]: 'https://api.synthex.finance/',
	[ChainID.AURORA]: 'http://localhost:3030/',
};
