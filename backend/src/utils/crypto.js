import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ENC_KEY || process.env.ENC_KEY.length !== 64) {
    throw new Error("ENC_KEY must be set and 32 bytes (64 hex characters) long");
}

const ENC_KEY = Buffer.from(process.env.ENC_KEY, "hex");
const IV_LENGTH = 16;

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return iv.toString("hex") + ":" + encrypted + ":" + authTag;
};

export const decrypt = (data) => {
  const [ivHex, encrypted, authTagHex] = data.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
