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

async function loadImageAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch image");
  return await res.blob();
}

export async function unscrambleImageData(
  imageUrl: string,
  drmData: string,
): Promise<ImageData> {
  const blob = await loadImageAsBlob(imageUrl);
  const image = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const unscrambled = await unscrambleImage(imageData, drmData);
  return unscrambled;
}
