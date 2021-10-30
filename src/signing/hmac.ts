/* eslint-disable import/no-extraneous-dependencies */
import crypto from "crypto";

/**
 * Builds the canonical Polymarket CLOB HMAC signature
 * @param signer
 * @param key
 * @param secret
 * @param passphrase
 * @returns string
 */
export const buildPolyHmacSignature = async (
    secret: string,
    timestamp: number,
    method: string,
    requestPath: string,
    body?: string,
): Promise<string> => {
    let message = timestamp + method + requestPath;
    if (body !== undefined) {
        message += body;
    }
    const base64Secret = Buffer.from(secret, "base64");
    const hmac = crypto.createHmac("sha256", base64Secret);
    const sig = hmac.update(message).digest("base64");

    // NOTE: Must be url safe base64 encoding, but keep base64 "=" suffix
    const sigUrlSafe = sig
        .replaceAll(/\+/g, "-") // Convert '+' to '-'
        .replaceAll(/\//g, "_"); // Convert '/' to '_'
    return sigUrlSafe;
};
