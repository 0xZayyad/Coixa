import * as bip39 from "bip39";
import * as ed25519 from "micro-key-producer/slip10.js";
import * as Stellar from "@stellar/stellar-sdk";
export const generateKeypair = () => {
  const mnemonic = bip39.generateMnemonic(256);
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const hdKey = ed25519.HDKey.fromMasterSeed(seed);

  const derivedKey = hdKey.derive("m/44'/314159'/0'");
  console.log("Derived key:", derivedKey.publicKey.toString());
  const keypair = Stellar.Keypair.fromRawEd25519Seed(derivedKey.privateKey);

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
    mnemonic,
  };
};

export const unlockWallet = (mnemonic: string) => {
  console.log(mnemonic);
  const isValidMnemonic = bip39.validateMnemonic(mnemonic);
  console.log(isValidMnemonic);
  if (!isValidMnemonic) return null;

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  console.log("Seed:", seed);
  const hdKey = ed25519.HDKey.fromMasterSeed(seed).derive("m/44'/314159'/0'");
  const keypair = Stellar.Keypair.fromRawEd25519Seed(hdKey.privateKey);
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
};
