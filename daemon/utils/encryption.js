import crypto from "crypto";
import "dotenv/config";

const ALGORITHM = "aes-256-gcm";
const KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// ✅ Validate encryption key
if (!KEY) {
  throw new Error("ENCRYPTION_KEY is not set in environment variables");
}
if (KEY.length !== 64) {
  throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes for AES-256-GCM)");
}

/**
 * Encrypts a string using AES-256-GCM.
 * @param {string} plainText
 * @returns {string} iv:authTag:encrypted
 */
export function encryptEnvValue(plainText) {
  if (typeof plainText !== "string") {
    throw new Error("encryptEnvValue expects a string as input");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with encryptEnvValue
 * @param {string} encryptedText format: iv:authTag:encrypted
 * @returns {string} decrypted plain text
 */
export function decryptEnvValue(encryptedText) {
  if (typeof encryptedText !== "string") {
    throw new Error("decryptEnvValue expects a string as input");
  }

  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format");
  }

  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
