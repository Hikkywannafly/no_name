// src/worker/unscramble.worker.ts

const DECRYPTION_KEY = "3141592653589793";

function decodeBase64(str: string): Uint8Array {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

function decodeXorCipher(data: Uint8Array, key: string): Uint8Array {
    const k = new TextEncoder().encode(key);
    return data.map((b, i) => b ^ k[i % k.length]);
}

function unscrambleImage(imageData: ImageData, drmData: string): ImageData {
    const decoded = decodeXorCipher(decodeBase64(drmData), DECRYPTION_KEY);
    const instruction = new TextDecoder().decode(decoded);

    if (!instruction.startsWith("#v4|")) {
        throw new Error("Invalid DRM data format");
    }

    const result = new ImageData(imageData.width, imageData.height);
    const resultData = result.data;
    const sourceData = imageData.data;
    let sourceY = 0;

    for (const token of instruction.split("|").slice(1)) {
        const [destY, height] = token.split("-").map(Number);
        const sourceStart = sourceY * imageData.width * 4;
        const destStart = destY * imageData.width * 4;
        const rowLength = imageData.width * 4 * height;

        resultData.set(
            sourceData.slice(sourceStart, sourceStart + rowLength),
            destStart,
        );
        sourceY += height;
    }

    return result;
}

self.onmessage = (e: MessageEvent) => {
    try {
        const { imageData, drmData } = e.data;
        const unscrambled = unscrambleImage(imageData, drmData);
        // Trả về imageData đã decode, truyền buffer để tối ưu hiệu năng
        (self as any).postMessage({ unscrambled }, [unscrambled.data.buffer]);
    } catch (err) {
        (self as any).postMessage({ error: err instanceof Error ? err.message : String(err) });
    }
}; 