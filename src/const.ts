import { ChainID } from "./chains";

export const deployments = {
    [ChainID.NILE]: require("../artifacts/nile.json"),
    [ChainID.AURORA]: require("../artifacts/aurora_testnet.json"),
    [ChainID.HARMONY]: require("../artifacts/harmony_testnet.json")
}