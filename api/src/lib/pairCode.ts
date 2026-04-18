// Pair code generator — 6 chars, uppercase alphanumeric, no ambiguous glyphs.
// Avoids 0/O and 1/I so users can read them aloud without confusion.

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generatePairCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function pairCodeExpiry(minutes = 15): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
