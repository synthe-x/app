import Web3 from "web3";
import Contract from "web3-eth-contract";

const config = require("../config.json");
let data = require(`../artifacts/deployments.json`)

export async function getContract(name: string, address: (string|null) = null, mock: boolean = false) {
    if(!address) address = data["contracts"][name]["address"]
    const abi = data["sources"][name];
    const contractInstance = await (window as any).tronWeb.contract(abi, address);
    return contractInstance;
}

export function getAddress(name: string) {
    return data["contracts"][name]["address"]
}

export function getABI(name: string) {
    return data["sources"][name];
}