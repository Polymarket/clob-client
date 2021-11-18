import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { 
    ERC1155_ABI, 
    ERC20_ABI, 
    EXECUTOR_ABI, 
    LIMIT_ORDER_PROTOCOL_ABI, 
    getContracts 
} from "@polymarket/order-utils";


export const getExchangeContract= async (signer: Wallet | JsonRpcSigner): Promise<Contract> => {
    const chainID = await signer.getChainId();
    return new Contract(getContracts(chainID).Exchange, LIMIT_ORDER_PROTOCOL_ABI, signer);
}

export const getExecutorContract = async (signer: Wallet | JsonRpcSigner): Promise<Contract> => {
    const chainID = await signer.getChainId();
    return new Contract(getContracts(chainID).Executor, EXECUTOR_ABI, signer);
}


export const getErc20TokenContract = async (signer: Wallet | JsonRpcSigner, erc20TokenAddress: string) : Promise<Contract> => {
    return new Contract(erc20TokenAddress, ERC20_ABI, signer); 
}


export const getCollateralContract = async (signer: Wallet | JsonRpcSigner) : Promise<Contract> => {
    const chainID = await signer.getChainId();
    return getErc20TokenContract(signer, getContracts(chainID).Collateral);
}


export const getConditionalTokenContract = async(signer: Wallet| JsonRpcSigner, conditionalTokenAddress: string) : Promise<Contract> => {
    return new Contract(conditionalTokenAddress, ERC1155_ABI, signer);   
}