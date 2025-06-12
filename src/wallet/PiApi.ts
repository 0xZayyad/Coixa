import {
  TransactionBuilder,
  Operation,
  Keypair,
  Asset,
  Horizon,
  Memo,
} from "@stellar/stellar-sdk";

export const PiNetwork = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
} as const;
export type PiNetwork = (typeof PiNetwork)[keyof typeof PiNetwork];

const HORIZON_ENDPOINTS = {
  [PiNetwork.MAINNET]: "https://api.mainnet.minepi.com",
  [PiNetwork.TESTNET]: "https://api.testnet.minepi.com",
};

const NETWORK_PASSPHRASES = {
  [PiNetwork.MAINNET]: "Pi Network",
  [PiNetwork.TESTNET]: "Pi Testnet",
};

export class PiApi {
  // private network: PiNetwork;
  private horizonUrl: string;
  private networkPassphrase: string;
  public server: Horizon.Server;

  constructor(network: PiNetwork = PiNetwork.TESTNET) {
    // this.network = network;
    this.networkPassphrase = NETWORK_PASSPHRASES[network];
    this.horizonUrl = HORIZON_ENDPOINTS[network];
    this.server = new Horizon.Server(this.horizonUrl);
  }

  /**
   *
   * @param sourceSecret
   * @param destPublicKey
   * @param amount
   * @param memo
   * @returns
   */
  public async sendTransaction(
    sourceSecret: string,
    destPublicKey: string,
    amount: string,
    memo?: string
  ) {
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const sourcePublicKey = sourceKeypair.publicKey();

    try {
      const account = await this.server.loadAccount(sourcePublicKey);
      const fee = await this.server.fetchBaseFee();
      console.log(account, fee);
      const _memo = memo ? Memo.text(memo) : undefined;

      const transaction = new TransactionBuilder(account, {
        networkPassphrase: this.networkPassphrase,
        fee: fee.toString(),
        memo: _memo,
      })
        .addOperation(
          Operation.payment({
            destination: destPublicKey,
            asset: Asset.native(),
            amount,
          })
        )
        .setTimeout(40)
        .build();
      transaction.sign(sourceKeypair);
      const response = await this.server.submitTransaction(transaction);
      console.log(response);
      return response;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        throw new Error(`Transaction failed: ${error.response.data.details}`);
      }
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  public async payments(publicKey: string, limit: number = 10) {
    return this.server
      .payments()
      .forAccount(publicKey)
      .limit(limit)
      .order("desc")
      .call();
  }

  public async requestAirdrop() {}
}
