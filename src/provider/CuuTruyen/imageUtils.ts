const DECRYPTION_KEY = "3141592653589793";

export function decodeBase64(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export function decodeXorCipher(data: Uint8Array, key: string): Uint8Array {
  const k = new TextEncoder().encode(key);
  return data.map((b, i) => b ^ k[i % k.length]);
}

export async function unscrambleImage(
  imageData: ImageData,
  drmData: string,
): Promise<ImageData> {
  const data = pipe(
    pipe(decodeBase64(drmData), (bytes) =>
      decodeXorCipher(bytes, DECRYPTION_KEY),
    ),
    (bytes) => new TextDecoder().decode(bytes),
  );

  if (!data.startsWith("#v4|")) {
    throw new Error(
      "Invalid DRM data (does not start with expected magic bytes)",
    );
  }

  const result = new ImageData(imageData.width, imageData.height);
  const resultData = result.data;
  const sourceData = imageData.data;
  let sourceY = 0;

  for (const token of data.split("|").slice(1)) {
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
  console.log("Unscrambled image data:", resultData);
  return result;
}

function pipe<T, R>(value: T, fn: (value: T) => R): R {
  return fn(value);
}
