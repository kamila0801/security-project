import CryptoES from 'crypto-es';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class
 * EncrptionUtility
 * @description A utility class for encrypting and decrypting strings using AES encryption
 */
export class EncryptionUtility {

  constructor() {
    // Empty constructor as this is a utility class
  }

  /**
   * @function
   * @description Generates a random Initialization Vector (IV) for AES encryption
   * @returns {string} A 16-character string to be used as an IV
   */
  public static createIV(): string {
    return uuidv4().replace(/-/g,"").substring(0, 16);
  }

  /**
   * @function
   * @description Encrypts a string using AES encryption
   * @param {string} dataStr - The data to be encrypted
   * @param {string} ivStr - The initialization vector for encryption
   * @param {string} keyStr - The secret key for encryption
   * @returns {string} The encrypted string
   */
  public static encrypt(dataStr: string, ivStr: string, keyStr: string): string {
    const key = EncryptionUtility.getParsedValue(keyStr);
    const iv = EncryptionUtility.getParsedValue(ivStr);
    const data = EncryptionUtility.getParsedValue(dataStr);

    const encryptedData = CryptoES.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoES.mode.CBC,
      padding: CryptoES.pad.Pkcs7
    });
    return encryptedData.toString();
  }

  /**
   * @function
   * @description Decrypts a string using AES encryption
   * @param {string} cipherText - The encrypted data to be decrypted
   * @param {string} ivStr - The initialization vector used for encryption
   * @param {string} keyStr - The secret key used for encryption
   * @returns {string} The decrypted string
   */
  public static decrypt(cipherText: string, ivStr: string, keyStr: string): string {
    const key = EncryptionUtility.getParsedValue(keyStr);
    const iv = EncryptionUtility.getParsedValue(ivStr);

    const decryptedData = CryptoES.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoES.mode.CBC,
      padding: CryptoES.pad.Pkcs7
    });
    return decryptedData.toString(CryptoES.enc.Utf8);
  }

  /**
   * @function
   * @description Parses a string into a format usable by CryptoJS
   * @param {string} valueToParse - The value to be parsed
   * @returns {any} The parsed value
   */
  public static getParsedValue(valueToParse: string): any {
    return CryptoES.enc.Utf8.parse(valueToParse);
  }
}
