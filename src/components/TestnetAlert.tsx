import React from "react";
import { useWallet } from "../context/WalletContext";
import { PiNetwork } from "../wallet/PiApi";
import { Alert } from "@mui/material";

const TestnetAlert: React.FC = () => {
  const { wallet, network } = useWallet();
  return (
    wallet &&
    network === PiNetwork.TESTNET && (
      <Alert
        severity="warning"
        icon={false}
        sx={{
          border: 0,
          borderRadius: 0,
          width: "100%",
          zIndex: 1000,
          textAlign: "center",
        }}
      >
        You are currently in Testnet mode.
      </Alert>
    )
  );
};

export default TestnetAlert;
