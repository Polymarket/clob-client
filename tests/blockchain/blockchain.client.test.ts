import "mocha";
import { expect } from "chai";
import { ethers } from "ethers";
import {
    getSafeTransactionHash,
    generateSafeSignatureFromHash,
} from "../../src/blockchain/blockchain.client";
import { Chain, SafeTransactionHashParams } from "../../src";

const refundReceiver = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10";
describe("BlockchainClient Pure Functions", () => {
    describe("getSafeTransactionHash", () => {
        it("should generate consistent transaction hash for same inputs", () => {
            const params: SafeTransactionHashParams = {
                safeAddress: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                to: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                value: BigInt(0),
                data: "0x1234",
                operation: 0,
                safeTxGas: BigInt(0),
                baseGas: BigInt(0),
                gasPrice: BigInt(0),
                gasToken: ethers.constants.AddressZero,
                refundReceiver,
                nonce: BigInt(1),
            };

            const hash1 = getSafeTransactionHash(params, Chain.POLYGON);
            const hash2 = getSafeTransactionHash(params, Chain.POLYGON);

            expect(hash1).to.equal(hash2);
            expect(hash1).to.be.a("string");
            expect(hash1.startsWith("0x")).to.be.true;
            expect(hash1.length).to.equal(66); // 0x + 64 hex chars
        });

        it("should generate different hashes for different safe addresses", () => {
            const baseParams = {
                to: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                value: BigInt(0),
                data: "0x1234",
                operation: 0,
                safeTxGas: BigInt(0),
                baseGas: BigInt(0),
                gasPrice: BigInt(0),
                gasToken: ethers.constants.AddressZero,
                refundReceiver,
                nonce: BigInt(1),
            };

            const hash1 = getSafeTransactionHash(
                {
                    ...baseParams,
                    safeAddress: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                },
                Chain.POLYGON,
            );

            const hash2 = getSafeTransactionHash(
                {
                    ...baseParams,
                    safeAddress: "0x0987654321098765432109876543210987654321",
                },
                Chain.POLYGON,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it("should generate different hashes for different nonces", () => {
            const baseParams = {
                safeAddress: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                to: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                value: BigInt(0),
                data: "0x1234",
                operation: 0,
                safeTxGas: BigInt(0),
                baseGas: BigInt(0),
                gasPrice: BigInt(0),
                gasToken: ethers.constants.AddressZero,
                refundReceiver,
            };

            const hash1 = getSafeTransactionHash(
                { ...baseParams, nonce: BigInt(1) },
                Chain.POLYGON,
            );
            const hash2 = getSafeTransactionHash(
                { ...baseParams, nonce: BigInt(2) },
                Chain.POLYGON,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it("should generate different hashes for different chain IDs", () => {
            const params: SafeTransactionHashParams = {
                safeAddress: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                to: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                value: BigInt(0),
                data: "0x1234",
                operation: 0,
                safeTxGas: BigInt(0),
                baseGas: BigInt(0),
                gasPrice: BigInt(0),
                gasToken: ethers.constants.AddressZero,
                refundReceiver,
                nonce: BigInt(1),
            };

            const hash1 = getSafeTransactionHash(params, Chain.POLYGON);
            const hash2 = getSafeTransactionHash(params, Chain.AMOY);

            expect(hash1).to.not.equal(hash2);
        });

        it("should generate different hashes for different data", () => {
            const baseParams = {
                safeAddress: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                to: "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
                value: BigInt(0),
                operation: 0,
                safeTxGas: BigInt(0),
                baseGas: BigInt(0),
                gasPrice: BigInt(0),
                gasToken: ethers.constants.AddressZero,
                refundReceiver,
                nonce: BigInt(1),
            };

            const hash1 = getSafeTransactionHash({ ...baseParams, data: "0x1234" }, Chain.POLYGON);
            const hash2 = getSafeTransactionHash({ ...baseParams, data: "0x5678" }, Chain.POLYGON);

            expect(hash1).to.not.equal(hash2);
        });
    });

    describe("generateSafeSignatureFromHash", () => {
        it("should generate consistent signature for same inputs", () => {
            const txHash = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10123456789012345678901234";
            const ownerAddress = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10";

            const sig1 = generateSafeSignatureFromHash(txHash, ownerAddress);
            const sig2 = generateSafeSignatureFromHash(txHash, ownerAddress);

            expect(sig1).to.equal(sig2);
            expect(sig1).to.be.a("string");
            expect(sig1.startsWith("0x")).to.be.true;
        });

        it("should generate different signatures for different owner addresses", () => {
            const txHash = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10123456789012345678901234";

            const sig1 = generateSafeSignatureFromHash(
                txHash,
                "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10",
            );
            const sig2 = generateSafeSignatureFromHash(
                txHash,
                "0x1111111111111111111111111111111111111111",
            );

            expect(sig1).to.not.equal(sig2);
        });

        it("should generate different signatures for different transaction hashes", () => {
            const ownerAddress = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10";

            const sig1 = generateSafeSignatureFromHash(
                "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10123456789012345678901234",
                ownerAddress,
            );
            const sig2 = generateSafeSignatureFromHash(
                "0x5678567856785678567856785678567856785678567856785678567856785678",
                ownerAddress,
            );

            expect(sig1).to.not.equal(sig2);
        });

        it("should include v=1 for approved hash signature type", () => {
            const txHash = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10123456789012345678901234";
            const ownerAddress = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10";

            const signature = generateSafeSignatureFromHash(txHash, ownerAddress);

            // The signature is packed as [r (32 bytes), s (32 bytes), v (1 byte)]
            // v=1 should be the last byte, which is "01" in hex
            expect(signature.endsWith("01")).to.be.true;
        });

        it("should properly encode owner address as r parameter", () => {
            const txHash = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10123456789012345678901234";
            const ownerAddress = "0xE04BcBb9d3F287299E69e7aFA65f0eA32903ff10";

            const signature = generateSafeSignatureFromHash(txHash, ownerAddress);

            // The first 32 bytes (64 hex chars after 0x) should be the padded owner address
            const rPart = signature.slice(2, 66); // Get first 32 bytes
            // Owner address should be at the end of r (right-padded with zeros on the left)
            expect(rPart.toLowerCase().endsWith(ownerAddress.slice(2).toLowerCase())).to.be.true;
        });
    });
});
