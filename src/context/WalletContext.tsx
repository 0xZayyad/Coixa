import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { PiWallet } from "../wallet";
import { SecureStorage } from "../services/SecureStorage";
import type { PiNetwork } from "../wallet/PiApi";

interface WalletContextType {
  wallet: PiWallet | null;
  network: PiNetwork;
  setNetwork: (network: PiNetwork) => void;
  createWallet: (wallet: PiWallet, pin: string) => Promise<void>;
  importWallet: (wallet: PiWallet, pin: string) => Promise<void>;
  unlockWallet: (pin: string) => Promise<boolean>;
  lockWallet: () => void;
  logout: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [network, setNetwork] = useState<PiNetwork>(SecureStorage.getNetwork());
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing wallet on startup
    if (SecureStorage.hasWallet() && !wallet) {
      navigate("/unlock");
    }
  }, [wallet, navigate]);

  const createWallet = async (newWallet: PiWallet, pin: string) => {
    try {
      await SecureStorage.storeWallet(
        {
          mnemonic: newWallet.mnemonic,
          publicKey: newWallet.publicKey,
          secretKey: newWallet.secretKey,
        },
        pin
      );
      setWallet(newWallet);
      await SecureStorage.createSession();
      navigate("/dashboard");
    } catch (err) {
      throw new Error("Failed to store wallet");
    }
  };

  const importWallet = async (newWallet: PiWallet, pin: string) => {
    try {
      await SecureStorage.storeWallet(
        {
          mnemonic: newWallet.mnemonic,
          publicKey: newWallet.publicKey,
          secretKey: newWallet.secretKey,
        },
        pin
      );
      setWallet(newWallet);
      await SecureStorage.createSession();
      navigate("/dashboard");
    } catch (err) {
      throw new Error("Failed to import wallet");
    }
  };

  const unlockWallet = async (pin: string) => {
    try {
      const walletData = await SecureStorage.getWallet(pin);
      const unlockedWallet = PiWallet.fromMnemonic(
        walletData.mnemonic,
        network
      );
      setWallet(unlockedWallet);
      await SecureStorage.createSession();
      navigate("/dashboard");
      return true;
    } catch (err) {
      return false;
    }
  };

  const lockWallet = () => {
    SecureStorage.clearSession();
    setWallet(null);
    navigate("/unlock");
  };

  const logout = () => {
    SecureStorage.clearSession();
    SecureStorage.clearWallet();
    setWallet(null);
    navigate("/");
  };

  useEffect(() => {
    SecureStorage.updateNetwork(network);
    if (wallet) {
      const newWallet = PiWallet.fromMnemonic(wallet.mnemonic, network);
      setWallet(newWallet);
    }
  }, [network]);

  const value = {
    wallet,
    network,
    setNetwork,
    createWallet,
    importWallet,
    unlockWallet,
    lockWallet,
    logout,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
