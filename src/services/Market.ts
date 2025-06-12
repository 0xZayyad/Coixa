import type { PiNetwork } from "../wallet/PiApi";

export const fetchPiPrice = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd&include_24hr_change=true"
  );
  const data = await res.json();
  return {
    price: data["pi-network"].usd,
    change24h: data["pi-network"].usd_24h_change,
  };
};

export const getExplorerUrl = (network: PiNetwork, txHash: string) => {
  const baseUrl =
    network === "mainnet"
      ? "https://blockexplorer.minepi.com/mainnet"
      : "https://blockexplorer.minepi.com/testnet";
  return `${baseUrl}/transactions/${txHash}`;
};
