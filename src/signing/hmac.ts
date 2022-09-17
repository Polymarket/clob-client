import crypto from "crypto";

function replaceAll(s: string, search: string, replace: string) {
    return s.split(search).join(replace);
}

/**
 * Builds the canonical Polymarket CLOB HMAC signature
 * @param signer
 * @param key
 * @param secret
 * @param passphrase
 * @returns string
 */
export const buildPolyHmacSignature = (
    secret: string,
    timestamp: number,
    method: string,
    requestPath: string,
    body?: string,
): string => {
    let message = timestamp + method + requestPath;
    if (body !== undefined) {
        message += body;
    }
    const base64Secret = Buffer.from(secret, "base64");
    const hmac = crypto.createHmac("sha256", base64Secret);
    const sig = hmac.update(message).digest("base64");

    // NOTE: Must be url safe base64 encoding, but keep base64 "=" suffix
    // Convert '+' to '-'
    // Convert '/' to '_'
    const sigUrlSafe = replaceAll(replaceAll(sig, "+", "-"), "/", "_");
    return sigUrlSafe;
};
