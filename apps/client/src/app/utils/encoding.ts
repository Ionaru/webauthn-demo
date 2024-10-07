export const toBase64 = (buffer: ArrayBuffer) =>
  btoa(String.fromCodePoint(...new Uint8Array(buffer)));
export const toBuffer = (text: string) =>
  Uint8Array.from(text, (c) => c.codePointAt(0)!).buffer;
