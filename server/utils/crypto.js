const crypto = require("crypto");
require("dotenv").config();

/*
 * AES-256-GCM encryption helpers for chat content.
 *
 * The key is read from process.env.CHAT_ENCRYPTION_KEY and must be 32 bytes
 * encoded as 64 hex characters. Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Each value is encrypted with a fresh random 12-byte IV. The 16-byte GCM auth
 * tag is stored alongside the ciphertext so we can verify integrity on decrypt.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getKey = () => {
  const rawKey = process.env.CHAT_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error(
      "CHAT_ENCRYPTION_KEY is not set. Add a 64-character hex key to your .env file."
    );
  }
  const key = Buffer.from(rawKey, "hex");
  if (key.length !== 32) {
    throw new Error(
      "CHAT_ENCRYPTION_KEY must be a 32-byte value encoded as 64 hex characters."
    );
  }
  return key;
};

// Encrypt a UTF-8 string. Returns hex-encoded { content, iv, tag }.
const encryptText = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    content: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
};

// Reverse of encryptText. Accepts hex-encoded { content, iv, tag }.
const decryptText = ({ content, iv, tag }) => {
  if (!content || !iv || !tag) return "";
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

// Encrypt raw bytes (e.g. an uploaded file). Returns { data: Buffer, iv, tag }.
const encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const data = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    data,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
};

// Reverse of encryptBuffer. Returns the original plaintext Buffer.
const decryptBuffer = (buffer, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
};

module.exports = {
  encryptText,
  decryptText,
  encryptBuffer,
  decryptBuffer,
};
