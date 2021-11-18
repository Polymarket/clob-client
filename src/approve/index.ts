import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner, TransactionResponse } from "@ethersproject/providers";
import { ClobContracts, getContracts } from "@polymarket/order-utils";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { getCollateralContract, getConditionalTokenContract } from "../contracts";

// TODO: for use with the site, the below functions should return
// signed transactions that the relayers can execute.
// Similar pattern as polymarket-sdk

const approveERC20 = async (signer: Wallet | JsonRpcSigner, spender: string) => {
    const address = await signer.getAddress();
    const token = await getCollateralContract(signer);

    const allowance: BigNumber = await token.allowance(address, spender);

    if (allowance.lt(MaxUint256)) {
        const txn: TransactionResponse = await token.approve(spender, MaxUint256);
        console.log(`Approve transaction hash: ${txn.hash} is being confirmed...`);
        await txn.wait();
        console.log(`Confirmed!`);
    }
};

const approveERC1155 = async (signer: Wallet | JsonRpcSigner, tokenAddress: string, spender: string) => {
    const address = await signer.getAddress();
    const token = await getConditionalTokenContract(signer, tokenAddress);
    const approved: boolean = await token.isApprovedForAll(address, spender);

    if (!approved) {
        console.log(`Approving ERC1155 token: ${tokenAddress} on spender: ${spender}`);
        const txn: TransactionResponse = await token.setApprovalForAll(spender, true);
        await txn.wait();
        console.log(`Confirmed!`);
    }
};

export const approveCollateral = async (signer: Wallet | JsonRpcSigner): Promise<any> => {
    const chainID = await signer.getChainId();
    const clobContracts: ClobContracts = getContracts(chainID);

    // Approve collateral on exchange
    await approveERC20(signer, clobContracts.Exchange);

    // Approve collateral on executor
    await approveERC20(signer, clobContracts.Executor);
};

export const approveConditionalToken = async (signer: Wallet | JsonRpcSigner, conditionalTokenAddress: string) => {
    const chainID = await signer.getChainId();
    const clobContracts: ClobContracts = getContracts(chainID);

    // Approve conditional token on exchange
    await approveERC1155(signer, conditionalTokenAddress, clobContracts.Exchange);

    // Approve conditional token on executor
    await approveERC1155(signer, conditionalTokenAddress, clobContracts.Executor);
};
