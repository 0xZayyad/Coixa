declare module "@exodus/slip10";

import { PiWallet } from "./wallet";

export interface SendTransactionProps {
  wallet: PiWallet;
  balance: string;
  onClose: () => void;
}

export interface QRCodeProps {
  wallet: PiWallet;
}

export interface WalletDashboardProps {
  onLogout: () => void;
}
