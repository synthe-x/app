import Web3 from "web3";
var Contract = require('web3-eth-contract');
import { ChainID } from "./chains";
import { deployments } from "./const";

export async function getContract(web3: any, abi: any, address: (string|null) = null, chain: ChainID) {
    var contract
    if(chain != ChainID.NILE){
        contract = new web3.eth.Contract(abi, address);
    } else {
        contract = await web3.contract(abi, address);
    }
    return contract;
}

export function getAddress(chain: ChainID, name: string) {
    return (deployments as any)[chain]["contracts"][name]["address"]
}

export function getABI(chain: ChainID, name: string) {
    return (deployments as any)[chain]["sources"][name];
}

export function call(contract: any, method: string, args: any[], network: ChainID){
    return contract.methods[method](...args).call()
}

export function send(web3: any, contract: any, method: string, network: ChainID){
    return new Promise((resolve, reject) => {
        
    })
}