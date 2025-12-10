import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import type { ApiKeyCreds, IRfqClient } from "../src/index.ts";
import { Chain, ClobClient } from "../src/index.ts";
import type { RfqTestCase } from "./rfqTestCases.ts";
import { RFQ_TEST_CASES } from "./rfqTestCases.ts";

dotenvConfig({ path: resolve(import.meta.dirname, "../.env") });

// Note: Token IDs and amounts are now specified directly in the test cases
const EXPIRATION_SECONDS = 3600;
const RUN_ONLY_PASSING = true;
const RUN_ONLY_FAILING = false;
const STOP_ON_FIRST_FAILURE = true;
const DELAY_BETWEEN_TESTS_MS = 1000;

interface TestResult {
	testCase: RfqTestCase;
	passed: boolean;
	actualResult: "success" | "error";
	error?: string;
	failedStep?: string;
	requestId?: string;
	quoteId?: string;
	duration: number;
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTestCase(
	testCase: RfqTestCase,
	takerClient: IRfqClient,
	makerClient: IRfqClient,
): Promise<TestResult> {
	const startTime = Date.now();
	const result: TestResult = {
		testCase,
		passed: false,
		actualResult: "success",
		duration: 0,
	};

	try {
		result.failedStep = "Step 1: Create RFQ Request";
		const rfqRequestResponse = await takerClient.createRfqRequest(testCase.request);

		if (rfqRequestResponse.error) {
			result.actualResult = "error";
			result.error = rfqRequestResponse.error;
			result.passed = !testCase.shouldPass;
			return result;
		}

		const requestId = rfqRequestResponse.requestId;
		result.requestId = requestId;

		result.failedStep = "Step 2: Create Quote";
		const rfqQuoteResponse = await makerClient.createRfqQuote({
			requestId: requestId,
			...testCase.quote,
		});

		if (rfqQuoteResponse.error) {
			result.actualResult = "error";
			result.error = rfqQuoteResponse.error;
			result.passed = !testCase.shouldPass;
			return result;
		}

		const quoteId = rfqQuoteResponse.quoteId;
		result.quoteId = quoteId;

		result.failedStep = "Step 3: Accept Quote";
		const acceptResult = await takerClient.acceptRfqQuote({
			requestId: requestId,
			quoteId: quoteId,
			expiration: Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS,
		});

		console.log(acceptResult);
		// Check for error response or success (either "OK" string or object with tradeIds)
		// Type assertion needed because HTTP helpers may return error objects at runtime
		const acceptResponse = acceptResult as unknown as { error?: string } | "OK" | { tradeIds: string[] };
		if (acceptResponse && typeof acceptResponse === "object" && "error" in acceptResponse) {
			result.actualResult = "error";
			result.error = typeof acceptResponse.error === "string" 
				? acceptResponse.error 
				: JSON.stringify(acceptResponse.error);
			result.passed = !testCase.shouldPass;
		} else {
			result.actualResult = "success";
			result.failedStep = undefined;
			result.passed = testCase.shouldPass;
		}

		result.failedStep = "Step 4: Approve Order";
		const approveResult = await makerClient.approveRfqOrder({
			requestId: requestId,
			quoteId: quoteId,
			expiration: Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS,
		});

		console.log(approveResult);
		// Check for error response or success (either "OK" string or object with tradeIds)
		// Type assertion needed because HTTP helpers may return error objects at runtime
		const approveResponse = approveResult as unknown as { error?: string } | "OK" | { tradeIds: string[] };
		if (approveResponse && typeof approveResponse === "object" && "error" in approveResponse) {
			result.actualResult = "error";
			result.error = typeof approveResponse.error === "string" 
				? approveResponse.error 
				: JSON.stringify(approveResponse.error);
			result.passed = !testCase.shouldPass;
		} else {
			result.actualResult = "success";
			result.failedStep = undefined;
			result.passed = testCase.shouldPass;
		}

	} catch (error: any) {
		result.actualResult = "error";
		result.error = error.message || String(error);
		result.passed = !testCase.shouldPass;
	} finally {
		result.duration = Date.now() - startTime;
	}

	return result;
}

async function main() {
	const takerWallet = new ethers.Wallet(`${process.env.REQUESTER_PK}`);
	const makerWallet = new ethers.Wallet(`${process.env.QUOTER_PK}`);
	const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
	const host = process.env.CLOB_API_URL || "http://localhost:8080";

	const takerCreds: ApiKeyCreds = {
		key: `${process.env.REQUESTER_API_KEY}`,
		secret: `${process.env.REQUESTER_SECRET}`,
		passphrase: `${process.env.REQUESTER_PASS_PHRASE}`,
	};

	const makerCreds: ApiKeyCreds = {
		key: `${process.env.QUOTER_API_KEY}`,
		secret: `${process.env.QUOTER_SECRET}`,
		passphrase: `${process.env.QUOTER_PASS_PHRASE}`,
	};

	const takerClob = new ClobClient(host, chainId, takerWallet, takerCreds);
	const makerClob = new ClobClient(host, chainId, makerWallet, makerCreds);

	const takerClient = takerClob.rfq;
	const makerClient = makerClob.rfq;

	console.log("RFQ Test Runner");
	console.log(`Taker: ${await takerWallet.getAddress()}`);
	console.log(`Maker: ${await makerWallet.getAddress()}`);
	console.log(`Chain ID: ${chainId}`);
	console.log(`Total Tests: ${RFQ_TEST_CASES.length}`);

	let testCasesToRun = RFQ_TEST_CASES;
	if (RUN_ONLY_PASSING) {
		testCasesToRun = testCasesToRun.filter(tc => tc.shouldPass);
		console.log(`Running only passing tests: ${testCasesToRun.length}`);
	} else if (RUN_ONLY_FAILING) {
		testCasesToRun = testCasesToRun.filter(tc => !tc.shouldPass);
		console.log(`Running only failing tests: ${testCasesToRun.length}`);
	}

	const results: TestResult[] = [];
	let testNumber = 0;

	for (const testCase of testCasesToRun) {
		testNumber++;
		console.log(`\nTest ${testNumber}/${testCasesToRun.length}: ${testCase.name}`);
		console.log(`${testCase.matchType} - ${testCase.description}`);
		console.log(`Expected: ${testCase.shouldPass ? "PASS" : "FAIL"}`);

		const result = await runTestCase(testCase, takerClient, makerClient);
		results.push(result);

		const statusText = result.passed ? "PASS" : "FAIL";
		const actualResultText = result.actualResult === "success" ? "succeeded" : "failed";
		
		console.log(`Result: ${statusText} (${actualResultText})`);
		if (result.failedStep && result.actualResult === "error") {
			console.log(`Failed at: ${result.failedStep}`);
		}
		if (result.error) {
			console.log(`Error: ${result.error}`);
		}
		if (result.requestId) {
			console.log(`Request ID: ${result.requestId}`);
		}
		if (result.quoteId) {
			console.log(`Quote ID: ${result.quoteId}`);
		}
		console.log(`Duration: ${result.duration}ms`);

		if (STOP_ON_FIRST_FAILURE && !result.passed) {
			console.log("\nStopping on first failure");
			break;
		}

		if (testNumber < testCasesToRun.length) {
			await sleep(DELAY_BETWEEN_TESTS_MS);
		}
	}

	console.log("\nTest Summary");
	const totalTests = results.length;
	const passedTests = results.filter(r => r.passed).length;
	const failedTests = totalTests - passedTests;
	const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

	console.log(`Total: ${totalTests}`);
	console.log(`Passed: ${passedTests}`);
	console.log(`Failed: ${failedTests}`);
	console.log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);

	if (failedTests > 0) {
		console.log("\nFailed Tests:");
		results.filter(r => !r.passed).forEach((result, idx) => {
			console.log(`${idx + 1}. ${result.testCase.name}: ${result.testCase.description}`);
			console.log(`   Expected: ${result.testCase.shouldPass ? "PASS" : "FAIL"}, Actual: ${result.actualResult}`);
			if (result.error) {
				console.log(`   Error: ${result.error}`);
			}
		});
	}

	process.exit(failedTests > 0 ? 1 : 0);
}

main();
