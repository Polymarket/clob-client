/**
 * RFQ Full Flow Example
 * 
 * This script demonstrates the complete RFQ (Request for Quote) flow between two parties.
 * For a single manual test, edit the REQUEST_PARAMS and QUOTE_PARAMS at the top.
 * This example assumes two EOA wallets. For using different signature types, see other RFQ examples.
 * 
 * 
 * Usage: npx tsx examples/rfqFullFlow.ts
 * 
 * TROUBLESHOOTING:
 * 1. Ensure the tokenID exists in your environment (staging vs production)
 * 2. Check that the market is active, RFQ-enabled and has liquidity
 * 3. Verify your quoter has been whitelisted
 * 4. Run `npx ts-node examples/getMarkets.ts` to get valid token IDs
 * 5. Make sure you're using the correct CLOB_API_URL for your environment
 * 
 * ENV VARIABLES:
 * REQUESTER_PK: Private key of the requester
 * REQUESTER_API_KEY: API key of the requester
 * REQUESTER_SECRET: Secret of the requester
 * REQUESTER_PASS_PHRASE: Passphrase of the requester
 * QUOTER_PK: Private key of the quoter
 * QUOTER_API_KEY: API key of the quoter
 * QUOTER_SECRET: Secret of the quoter
 * QUOTER_PASS_PHRASE: Passphrase of the quoter
 * CHAIN_ID: Chain ID of the network
 * CLOB_API_URL: URL of the CLOB API
 */

import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds } from "../src/index.ts";
import { Chain, ClobClient, Side } from "../src/index.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

// ============================================
// RFQ REQUEST PARAMETERS (REQUESTER) - EDIT THESE
// ============================================
const REQUEST_PARAMS = {
    tokenID: "34097058504275310827233323421517291090691602969494795225921954353603704046623",
    price: 0.5,         // Price per token (e.g., 0.50 = 50 cents)
    side: Side.BUY,     // Side.BUY or Side.SELL
    size: 40,           // Number of tokens
    tickSize: "0.01" as const,   // Minimum price increment: "0.1" | "0.01" | "0.001" | "0.0001"
};

// ============================================
// RFQ QUOTE PARAMETERS (QUOTER) - EDIT THESE
// ============================================
// For BUY request: quote is selling tokens for USDC (assetIn=0, assetOut=tokenID)
// For SELL request: quote is buying tokens with USDC (assetIn=tokenID, assetOut=0)
const QUOTE_PARAMS = {
    assetIn: "0",  // USDC (for BUY request)
    assetOut: "34097058504275310827233323421517291090691602969494795225921954353603704046623",
    amountIn: "20000000",   // 20 USDC (6 decimals)
    amountOut: "40000000",  // 40 tokens (6 decimals)
};

// ============================================
// ORDER EXPIRATION CONFIGURATION
// ============================================
const EXPIRATION_CONFIG = {
    expirationSeconds: 3600, // 1 hour
};

async function main() {
    // ============================================
    // Setup: Initialize both requester and quoter clients
    // ============================================
    
    // Requester (creates the request and accepts the quote)
    const requesterWallet = new ethers.Wallet(`${process.env.REQUESTER_PK}`);
    const requesterAddress = await requesterWallet.getAddress();
    
    // Quoter (creates the quote and approves the order)
    const quoterWallet = new ethers.Wallet(`${process.env.QUOTER_PK}`);
    const quoterAddress = await quoterWallet.getAddress();
    
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    
    console.log("=".repeat(60));
    console.log("RFQ Full Flow");
    console.log("=".repeat(60));
    console.log(`Requester Address: ${requesterAddress}`);
    console.log(`Quoter Address: ${quoterAddress}`);
    console.log(`Chain ID: ${chainId}`);
    console.log(`Host: ${host}`);
    console.log("=".repeat(60));
    
    // Requester credentials
    const requesterCreds: ApiKeyCreds = {
        key: `${process.env.REQUESTER_API_KEY}`,
        secret: `${process.env.REQUESTER_SECRET}`,
        passphrase: `${process.env.REQUESTER_PASS_PHRASE}`,
    };
    
    // Quoter credentials
    const quoterCreds: ApiKeyCreds = {
        key: `${process.env.QUOTER_API_KEY}`,
        secret: `${process.env.QUOTER_SECRET}`,
        passphrase: `${process.env.QUOTER_PASS_PHRASE}`,
    };
    
    const requesterClob = new ClobClient(host, chainId, requesterWallet, requesterCreds);
    const quoterClob = new ClobClient(host, chainId, quoterWallet, quoterCreds);

    const requesterClient = requesterClob.rfq;
    const quoterClient = quoterClob.rfq;
    
    // ============================================
    // Step 1: Requester creates RFQ request
    // ============================================
    console.log("\n[Step 1] Requester creating RFQ request...");
    console.log(`  Token ID: ${REQUEST_PARAMS.tokenID}`);
    console.log(`  Side: ${REQUEST_PARAMS.side}`);
    console.log(`  Size: ${REQUEST_PARAMS.size}`);
    console.log(`  Price: ${REQUEST_PARAMS.price}`);
    
    const rfqRequestResponse = await requesterClient.createRfqRequest(
        {
            tokenID: REQUEST_PARAMS.tokenID,
            price: REQUEST_PARAMS.price,
            side: REQUEST_PARAMS.side,
            size: REQUEST_PARAMS.size,
        },
        { tickSize: REQUEST_PARAMS.tickSize },
    );
    
    // Check for errors
    if (rfqRequestResponse.error) {
        console.error(`❌ Failed to create request. Error: ${rfqRequestResponse.error}`);
        throw new Error(`Request creation failed: ${rfqRequestResponse.error}`);
    }
    
    if (!rfqRequestResponse.requestId) {
        console.error("❌ Failed to create request. Response:", rfqRequestResponse);
        throw new Error("Request creation failed - no requestId returned");
    }
    
    const requestId = rfqRequestResponse.requestId;
    
    console.log(`✓ Request created successfully!`);
    console.log(`  Request ID: ${requestId}`);
    console.log(`  Full response:`, rfqRequestResponse);
    
    // ============================================
    // Step 2: Quoter creates quote for the request
    // ============================================
    console.log("\n[Step 2] Quoter creating quote for request...");
    console.log(`  Asset In: ${QUOTE_PARAMS.assetIn}`);
    console.log(`  Asset Out: ${QUOTE_PARAMS.assetOut}`);
    console.log(`  Amount In: ${QUOTE_PARAMS.amountIn}`);
    console.log(`  Amount Out: ${QUOTE_PARAMS.amountOut}`);
    
    const rfqQuoteResponse = await quoterClient.createRfqQuote({
        requestId: requestId,
        assetIn: QUOTE_PARAMS.assetIn,
        assetOut: QUOTE_PARAMS.assetOut,
        amountIn: QUOTE_PARAMS.amountIn,
        amountOut: QUOTE_PARAMS.amountOut,
    });
    
    // Check for errors
    if (rfqQuoteResponse.error) {
        console.error(`❌ Failed to create quote. Error: ${rfqQuoteResponse.error}`);
        throw new Error(`Quote creation failed: ${rfqQuoteResponse.error}`);
    }
    
    if (!rfqQuoteResponse.quoteId) {
        console.error("❌ Failed to create quote. Response:", rfqQuoteResponse);
        throw new Error("Quote creation failed - no quoteId returned");
    }
    
    const quoteId = rfqQuoteResponse.quoteId;
    
    console.log(`✓ Quote created successfully!`);
    console.log(`  Quote ID: ${quoteId}`);
    console.log(`  Request ID: ${requestId}`);
    console.log(`  Full response:`, rfqQuoteResponse);
    
    // ============================================
    // Step 3: Requester accepts the quote
    // ============================================
    console.log("\n[Step 3] Requester accepting quote...");
    
    const acceptResult = await requesterClient.acceptRfqQuote({
        requestId: requestId,
        quoteId: quoteId,
        expiration: Math.floor(Date.now() / 1000) + EXPIRATION_CONFIG.expirationSeconds,
    });
        
    console.log(acceptResult);
    console.log(`✓ Quote accepted successfully!`);
    console.log(`  Request ID: ${requestId}`);
    console.log(`  Quote ID: ${quoteId}`);
    
    // ============================================
    // Step 4: Quoter approves the order
    // ============================================
    console.log("\n[Step 4] Quoter approving order...");
    
    const approveResult = await quoterClient.approveRfqOrder({
        requestId: requestId,
        quoteId: quoteId,
        expiration: Math.floor(Date.now() / 1000) + EXPIRATION_CONFIG.expirationSeconds,
    });
    
    console.log(approveResult);
    console.log(`✓ Order approved successfully!`);
    console.log(`  Request ID: ${requestId}`);
    console.log(`  Quote ID: ${quoteId}`);
    
    // ============================================
    // Summary
    // ============================================
    console.log("\n" + "=".repeat(60));
    console.log("RFQ FLOW COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`Request ID: ${requestId}`);
    console.log(`Quote ID:   ${quoteId}`);
    console.log(`Requester:  ${requesterAddress}`);
    console.log(`Quoter:     ${quoterAddress}`);
    console.log("=".repeat(60));
}

main().catch(error => {
    console.error("\n❌ Error in RFQ flow:", error);
    if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
    }
    process.exit(1);
});
