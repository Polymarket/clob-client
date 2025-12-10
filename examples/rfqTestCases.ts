/**
 * RFQ Test Cases Configuration
 * 
 * This file defines test scenarios for the RFQ matching engine validation.
 * Each test case specifies the request and quote parameters, along with expected outcomes.
 * 
 * Match Types:
 * - COMPLEMENTARY: BUY <> SELL or SELL <> BUY (opposite sides)
 * - MINT: BUY <> BUY (prices should sum to >= 1, creates complete sets)
 * - MERGE: SELL <> SELL (prices should sum to <= 1, destroys complete sets)
 */

import type { RfqUserOrder, RfqUserQuote } from "../src/index.ts";
import { Side } from "../src/index.ts";

export interface RfqTestCase {
    name: string;
    description: string;
    matchType: "COMPLEMENTARY" | "MINT" | "MERGE";
    shouldPass: boolean;
    expectedError?: string;
    // Using user-friendly parameter types
    request: RfqUserOrder;
    quote: Omit<RfqUserQuote, 'requestId'>;
}

const OUTCOME_TOKEN_YES = "34097058504275310827233323421517291090691602969494795225921954353603704046623";
const OUTCOME_TOKEN_NO = "32868290514114487320702931554221558599637733115139769311383916145370132125101";

export const RFQ_TEST_CASES: RfqTestCase[] = [
    // ============================================
    // COMPLEMENTARY MATCHES (BUY <> SELL)
    // ============================================
    {
        name: "COMPLEMENTARY_01",
        description: "Valid Request SELL <> Quote BUY - prices cross exactly",
        matchType: "COMPLEMENTARY",
        shouldPass: true,
        request: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.SELL,
            size: 10,
            price: 0.6,
        },
        quote: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.BUY,
            size: 10,
            price: 0.6,
        },
    },
    // {
    //     name: "COMPLEMENTARY_02",
    //     description: "Valid Request SELL <> Quote BUY - buyer paying more than seller asking",
    //     matchType: "COMPLEMENTARY",
    //     shouldPass: true,
    //     request: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.SELL,
    //         size: 100,
    //         price: 0.7,
    //     },
    //     quote: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.BUY,
    //         size: 100,
    //         price: 0.8,
    //     },
    // },
    {
        name: "COMPLEMENTARY_03",
        description: "Valid Request BUY <> Quote SELL - prices cross exactly",
        matchType: "COMPLEMENTARY",
        shouldPass: true,
        request: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.BUY,
            size: 50,
            price: 0.4,
        },
        quote: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.SELL,
            size: 50,
            price: 0.4,
        },
    },
    // {
    //     name: "COMPLEMENTARY_04",
    //     description: "Valid Request BUY <> Quote SELL - seller willing to sell lower than buyer offering",
    //     matchType: "COMPLEMENTARY",
    //     shouldPass: true,
    //     request: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.BUY,
    //         size: 200,
    //         price: 0.3,
    //     },
    //     quote: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.SELL,
    //         size: 200,
    //         price: 0.25,
    //     },
    // },

    // ============================================
    // MERGE MATCHES (SELL <> SELL)
    // ============================================
    {
        name: "MERGE_01",
        description: "Valid Request SELL <> Quote SELL - prices sum to exactly 1",
        matchType: "MERGE",
        shouldPass: true,
        request: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.SELL,
            size: 100,
            price: 0.5,
        },
        quote: {
            tokenID: OUTCOME_TOKEN_NO,
            side: Side.SELL,
            size: 100,
            price: 0.5,
        },
    },
    // {
    //     name: "MERGE_02",
    //     description: "Valid Request SELL <> Quote SELL - prices sum to less than 1",
    //     matchType: "MERGE",
    //     shouldPass: true,
    //     request: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.SELL,
    //         size: 80,
    //         price: 0.25,
    //     },
    //     quote: {
    //         tokenID: OUTCOME_TOKEN_NO,
    //         side: Side.SELL,
    //         size: 60,
    //         price: 0.5,
    //     },
    // },

    // ============================================
    // MINT MATCHES (BUY <> BUY)
    // ============================================
    {
        name: "MINT_01",
        description: "Valid Request BUY <> Quote BUY - prices sum to exactly 1",
        matchType: "MINT",
        shouldPass: true,
        request: {
            tokenID: OUTCOME_TOKEN_YES,
            side: Side.BUY,
            size: 100,
            price: 0.5,
        },
        quote: {
            tokenID: OUTCOME_TOKEN_NO,
            side: Side.BUY,
            size: 100,
            price: 0.5,
        },
    },
    // {
    //     name: "MINT_02",
    //     description: "Valid Request BUY <> Quote BUY - prices sum to greater than 1",
    //     matchType: "MINT",
    //     shouldPass: true,
    //     request: {
    //         tokenID: OUTCOME_TOKEN_YES,
    //         side: Side.BUY,
    //         size: 125,
    //         price: 0.8,
    //     },
    //     quote: {
    //         tokenID: OUTCOME_TOKEN_NO,
    //         side: Side.BUY,
    //         size: 200,
    //         price: 0.5,
    //     },
    // },
];
