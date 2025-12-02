function replaceAll(s: string, search: string, replace: string) {
    return s.split(search).join(replace);
}

/**
 * Converts base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const base64Std = base64.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64Std + "===".slice((base64Std.length + 3) % 4);
    const binaryString = atob(normalized);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Converts ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

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

    // Import the secret key from base64
    const keyData = base64ToArrayBuffer(secret);
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );

    // Sign the message
    const messageBuffer = new TextEncoder().encode(message);
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageBuffer);
    const sig = arrayBufferToBase64(signatureBuffer);

    // NOTE: Must be url safe base64 encoding, but keep base64 "=" suffix
    // Convert '+' to '-'
    // Convert '/' to '_'
    const sigUrlSafe = replaceAll(replaceAll(sig, "+", "-"), "/", "_");
    return sigUrlSafe;
};
