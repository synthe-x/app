import { ChainID } from './chains';

const SubgraphQuery = `query fetchAppData {
    synths {
        synth_id
        name
        symbol
        liquidity
        apy
        totalBorrowed
        interestRateModel
        borrowIndex
        price
    }
    collaterals {
        coll_address
        name
        symbol
        price
        decimal
        cAsset
        liquidity
    }
    tradingPools {
        id
        name
        symbol
        poolSynth_ids {
            synth_id {
                id
                name
                symbol
                price
            }
            balance
        }
    }
}`

export const data: any = {
    [ChainID.AURORA]: {
        'subgraph': 'https://graph.synthex.finance/subgraphs/name/synthe-x/subgraph-at',
        'query': SubgraphQuery
    },
    [ChainID.HARMONY]: {
        'subgraph': 'https://graph.chainscore.finance/subgraphs/name/synthe-x/subgraph-ht',
        'query': SubgraphQuery
    },
    [ChainID.NILE]: {
        pools: 'https://api.synthex.finance/pool/all',
        system: 'https://api.synthex.finance/system',
        synths: 'https://api.synthex.finance/assets/synths',
        collaterals: 'https://api.synthex.finance/assets/collaterals'
    }
}