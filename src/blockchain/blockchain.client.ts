import { ethers } from "ethers";
import {
    getContractConfig,
    REDEEM_POSITIONS_GAS_LIMIT,
    REDEEM_POSITIONS_MINIMUM_MAX_FEE,
} from "../config";
import {
    ApproveHashOnSafeParams,
    Chain,
    RedeemMarketPositionsForSafeWalletParams,
    RedeemMarketPositionsParams,
    SafeTransactionHashParams,
} from "../types";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { CTF_ABI } from "./abi/ctf.abi";
import { SAFE_ABI } from "./abi/safe.abi";
import { AbiCoder } from "ethers/lib/utils";
import { JsonRpcSigner } from "@ethersproject/providers";

export function getCtfContract(
    wallet: ethers.Wallet | JsonRpcSigner,
    chainId: Chain,
): ethers.Contract {
    const contractConfig = getContractConfig(chainId);
    return new ethers.Contract(contractConfig.conditionalTokens, CTF_ABI, wallet);
}

/**
 * Generate the EIP-712 typed data hash for Safe transaction
 */
export function getSafeTransactionHash(params: SafeTransactionHashParams, chainId: Chain): string {
    const SAFE_TX_TYPEHASH = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
            "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas," +
                "uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)",
        ),
    );

    const abiCoder = new AbiCoder();
    const safeTxHash = ethers.utils.keccak256(
        abiCoder.encode(
            [
                "bytes32",
                "address",
                "uint256",
                "bytes32",
                "uint8",
                "uint256",
                "uint256",
                "uint256",
                "address",
                "address",
                "uint256",
            ],
            [
                SAFE_TX_TYPEHASH,
                params.to,
                params.value,
                ethers.utils.keccak256(params.data),
                params.operation,
                params.safeTxGas,
                params.baseGas,
                params.gasPrice,
                params.gasToken,
                params.refundReceiver,
                params.nonce,
            ],
        ),
    );

    const DOMAIN_SEPARATOR_TYPEHASH = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("EIP712Domain(uint256 chainId,address verifyingContract)"),
    );

    const domainSeparator = ethers.utils.keccak256(
        abiCoder.encode(
            ["bytes32", "uint256", "address"],
            [DOMAIN_SEPARATOR_TYPEHASH, chainId, params.safeAddress],
        ),
    );

    return ethers.utils.keccak256(
        ethers.utils.concat(["0x19", "0x01", domainSeparator, safeTxHash]),
    );
}

/**
 * Generate signature for Safe transaction
 * Polymarket Safes require approved hash signature (v=1)
 */
export function generateSafeSignatureFromHash(txHash: string, ownerAddress: string): string {
    // For Polymarket Safe: Use pre-validated signature format
    // v=1 means the hash was pre-approved on-chain
    const r = ethers.utils.zeroPad(ownerAddress, 32);
    const s = txHash;
    const v = 1; // Approved hash signature type

    return ethers.utils.solidityPack(["bytes32", "bytes32", "uint8"], [r, s, v]);
}

export class BlockchainClient {
    readonly wallet: ethers.Wallet | JsonRpcSigner;
    private readonly ctfContract: ethers.Contract;
    private readonly chainId;

    constructor(_wallet: ethers.Wallet | JsonRpcSigner, chainId: Chain) {
        this.wallet = _wallet;
        this.chainId = chainId;
        this.ctfContract = getCtfContract(this.wallet, chainId);
    }

    /**
     * Redeem positions for EOA (Externally Owned Account) wallets
     * Use this if you're NOT using a Safe/Proxy wallet
     */
    async redeemMarketPositionsForEOA(
        params: RedeemMarketPositionsParams,
    ): Promise<TransactionReceipt> {
        const contractConfig = getContractConfig(this.chainId);
        const tx = await this.ctfContract.redeemPositions(
            contractConfig.collateral,
            ethers.constants.HashZero,
            params.ConditionID,
            [1, 2],
            await this.getCurrentFeeParams(),
        );
        return await tx.wait();
    }

    /**
     * Redeem positions through Safe wallet with proper signature generation
     * Use this for Polymarket accounts (Magic/Email or Browser wallet)
     */
    async redeemMarketPositionsForSafeWallet(
        params: RedeemMarketPositionsForSafeWalletParams,
    ): Promise<TransactionReceipt> {
        const ctfInterface = new ethers.utils.Interface(CTF_ABI);
        const contractConfig = getContractConfig(this.chainId);
        const safeContract = new ethers.Contract(params.safeWalletAddress, SAFE_ABI, this.wallet);

        // Step 1: Get current nonce from Safe
        const nonce = await safeContract.nonce();

        // Step 2: Encode the redeemPositions call
        const redeemData = ctfInterface.encodeFunctionData("redeemPositions", [
            contractConfig.collateral,
            ethers.constants.HashZero,
            params.ConditionID,
            [1, 2],
        ]);

        // Step 3: Transaction parameters
        const to = contractConfig.conditionalTokens;
        const value = 0;
        const operation = 0; // CALL
        const safeTxGas = 0; // Estimate gas later
        const baseGas = 0; // Estimate base gas
        const gasPrice = 0;
        const gasToken = ethers.constants.AddressZero;
        const refundReceiver = ethers.constants.AddressZero;

        // Step 4: Generate transaction hash
        const txHash = getSafeTransactionHash(
            {
                safeAddress: params.safeWalletAddress,
                to,
                value,
                data: redeemData,
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                nonce,
            },
            this.chainId,
        );

        // Step 5: Approve hash on Safe first
        await this.approveHashOnSafe({
            txHash,
            safeWalletAddress: params.safeWalletAddress,
        });

        // Step 6: Generate signature from the approved hash
        const ownerAddress = await this.wallet.getAddress();

        const signature = generateSafeSignatureFromHash(txHash, ownerAddress);

        // Step 7: Execute transaction through Safe
        const tx = await safeContract.execTransaction(
            to,
            value,
            redeemData,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            refundReceiver,
            signature,
            { ...(await this.getCurrentFeeParams()), gasLimit: REDEEM_POSITIONS_GAS_LIMIT },
        );

        // Step 8: Wait for confirmation
        return await tx.wait();
    }

    private async getCurrentFeeParams(): Promise<{
        maxPriorityFeePerGas: ethers.BigNumber;
        maxFeePerGas: ethers.BigNumber;
    }> {
        // Get current fee data from the network
        const feeData = await this.wallet.provider.getFeeData();

        // Polygon network minimum requirements
        const minPriorityFee = ethers.utils.parseUnits(REDEEM_POSITIONS_MINIMUM_MAX_FEE, "gwei");
        const minMaxFee = ethers.utils.parseUnits(REDEEM_POSITIONS_MINIMUM_MAX_FEE, "gwei");

        if (!feeData.maxPriorityFeePerGas || !feeData.maxFeePerGas) {
            // Fallback to minimum values if fee data not available
            return {
                maxPriorityFeePerGas: minPriorityFee,
                maxFeePerGas: minMaxFee,
            };
        }

        // Use the higher of network fees or minimum requirements
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.gt(minPriorityFee)
            ? feeData.maxPriorityFeePerGas
            : minPriorityFee;

        const maxFeePerGas = feeData.maxFeePerGas.gt(minMaxFee) ? feeData.maxFeePerGas : minMaxFee;

        return {
            maxPriorityFeePerGas,
            maxFeePerGas,
        };
    }

    /**
     * Approve hash on Safe before executing transaction
     */
    private async approveHashOnSafe(params: ApproveHashOnSafeParams): Promise<void> {
        const APPROVE_HASH_ABI = [
            {
                inputs: [{ internalType: "bytes32", name: "hashToApprove", type: "bytes32" }],
                name: "approveHash",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
        ];

        const safeWithApprove = new ethers.Contract(
            params.safeWalletAddress,
            APPROVE_HASH_ABI,
            this.wallet,
        );

        const approveTx = await safeWithApprove.approveHash(
            params.txHash,
            await this.getCurrentFeeParams(),
        );
        await approveTx.wait();
    }
}
