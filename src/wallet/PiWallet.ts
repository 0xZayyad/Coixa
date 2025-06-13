import * as ed25519 from "micro-key-producer/slip10.js";
import { Horizon, Keypair } from "@stellar/stellar-sdk";
import { WalletUtils } from "./WalletUtils";
import { InvalidMnemonicError, WalletDerivationError } from "./errors";
import { PiApi, type PiNetwork } from "./PiApi";

const DERIVATION_PATH = "m/44'/314159'/0'";

export class PiWallet extends PiApi {
  public mnemonic: string;
  public publicKey: string;
  public secretKey: string;
  public balance: number | null;
  public account: Horizon.AccountResponse | null;
  public IS_ACTIVATED = true;

  constructor(mnemonic?: string, network?: PiNetwork) {
    super(network);
    if (mnemonic) {
      if (!WalletUtils.validateMnemonic(mnemonic)) {
        throw new InvalidMnemonicError();
      }
      this.mnemonic = mnemonic;
    } else {
      this.mnemonic = WalletUtils.generateMnemonic();
    }

    const seed = WalletUtils.mnemonicToSeed(this.mnemonic);
    const hdKey = ed25519.HDKey.fromMasterSeed(seed).derive(DERIVATION_PATH);

    if (!hdKey || !hdKey.privateKey) {
      throw new WalletDerivationError();
    }

    const keypair = Keypair.fromRawEd25519Seed(hdKey.privateKey);

    this.publicKey = keypair.publicKey();
    this.secretKey = keypair.secret();
    let account = null;
    let balance = null;
    this.loadAccount().then((res) => {
      this.account = res;
      balance = parseFloat(
        this.account?.balances.find((b) => b.asset_type === "native")
          ?.balance ?? ""
      );
    });
    this.account = account;
    this.balance = balance;
  }
  /**
   *
   * @param mnemonic The secret passphrase
   * @returns new PiWallet instance
   */
  static fromMnemonic(mnemonic: string, network?: PiNetwork): PiWallet {
    return new PiWallet(mnemonic, network);
  }

  /**
   * Generate a new Pi network compatible wallet
   * @returns new PiWallet instance
   */
  static generate(): PiWallet {
    return new PiWallet();
  }

  public async loadAccount() {
    try {
      let account = await this.server.loadAccount(this.publicKey);
      this.balance = parseFloat(
        account.balances.find((b) => b.asset_type === "native")?.balance ?? ""
      );
      return this.account;
    } catch (err: any) {
      console.log(err);
      console.log(err.response);
      if (err.response?.status == 404) {
        // Account does not exist, create a new one
        this.IS_ACTIVATED = false;
      }
      throw new Error(
        `Failed to load account: ${err.message || "Unknown error"}`
      );
    }
  }

  public async payments() {
    return super.payments(this.publicKey);
  }

  public async requestAirdrop() {
    // return this.server.
  }
  /**
   * sendTransaction
   */
  public sendTransaction(destPublickey: string, amount: string, memo?: string) {
    return super.sendTransaction(this.secretKey, destPublickey, amount, memo);
  }

  public async activateAccount(destPublicKey: string) {
    return super.activateAccount(this.secretKey, destPublicKey);
  }
}
