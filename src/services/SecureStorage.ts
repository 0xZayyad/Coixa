import CryptoJS from "crypto-js";
import { PiNetwork } from "../wallet/PiApi";

interface EncryptedData {
  data: string;
  iv: string;
}

export class SecureStorage {
  private static readonly WALLET_KEY = "encrypted_wallet";
  private static readonly SESSION_KEY = "wallet_session";
  private static readonly NETWORK_KEY = "pi_network";

  private static encryptData(data: any, pin: string): EncryptedData {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(pin, iv, {
      keySize: 256 / 32,
      iterations: 10000,
    });

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      data: encrypted.toString(),
      iv: iv.toString(),
    };
  }

  private static decryptData(encryptedData: EncryptedData, pin: string): any {
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
    const key = CryptoJS.PBKDF2(pin, iv, {
      keySize: 256 / 32,
      iterations: 10000,
    });

    const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  public static async storeWallet(walletData: any, pin: string): Promise<void> {
    const encrypted = this.encryptData(walletData, pin);
    localStorage.setItem(this.WALLET_KEY, JSON.stringify(encrypted));
  }

  public static async getWallet(pin: string): Promise<any> {
    const encryptedStr = localStorage.getItem(this.WALLET_KEY);
    if (!encryptedStr) {
      throw new Error("No wallet found in storage");
    }

    try {
      const encrypted = JSON.parse(encryptedStr) as EncryptedData;
      return this.decryptData(encrypted, pin);
    } catch (error) {
      throw new Error("Invalid PIN or corrupted wallet data");
    }
  }

  public static hasWallet(): boolean {
    return localStorage.getItem(this.WALLET_KEY) !== null;
  }

  public static async createSession(): Promise<string> {
    const sessionId = CryptoJS.lib.WordArray.random(32).toString();
    localStorage.setItem(this.SESSION_KEY, sessionId);
    return sessionId;
  }

  public static validateSession(sessionId: string): boolean {
    return localStorage.getItem(this.SESSION_KEY) === sessionId;
  }

  public static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  public static clearWallet(): void {
    localStorage.removeItem(this.WALLET_KEY);
  }

  public static updateNetwork(network: PiNetwork): void {
    localStorage.setItem(this.NETWORK_KEY, network);
  }

  public static getNetwork(): PiNetwork {
    return (
      (localStorage.getItem(this.NETWORK_KEY) as PiNetwork) || PiNetwork.TESTNET
    );
  }
}
