import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;

export const encryptData = (data) => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  const ciphertext = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
  return encodeURIComponent(ciphertext);
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(ciphertext), SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decryptedData);
  } catch {
    return decryptedData;
  }
};