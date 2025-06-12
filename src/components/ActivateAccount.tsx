import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { PiWallet } from "../wallet";
import { SuccessTx } from "./SuccessTx";

interface ActivateAccountProps {
  open: boolean;
  onClose: () => void;
  wallet: PiWallet | null;
}

const walletAddressRegex = /^G[A-Z2-7]{55}$/;

export const ActivateAccount: React.FC<ActivateAccountProps> = ({
  open,
  onClose,
  wallet,
}) => {
  const [activationAddress, setActivationAddress] = useState("");
  const [activationError, setActivationError] = useState("");
  const [activating, setActivating] = useState(false);
  const [activationTxHash, setActivationTxHash] = useState("");
  const [showSuccessTx, setShowSuccessTx] = useState(false);

  const handleActivateWallet = async () => {
    if (
      !wallet ||
      !activationAddress ||
      !walletAddressRegex.test(activationAddress)
    ) {
      setActivationError("Invalid wallet address");
      return;
    }

    try {
      setActivating(true);
      setActivationError("");
      const result = await wallet.activateAccount(activationAddress);
      setActivationTxHash(result.hash);
      handleClose();
      setShowSuccessTx(true);
    } catch (err: any) {
      setActivationError(err.message);
    } finally {
      setActivating(false);
    }
  };

  const handleClose = () => {
    setActivationAddress("");
    setActivationError("");
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ width: "90%", maxWidth: 500, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Activate Wallet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the wallet address you want to activate. This will send 1π to
            create the account.
          </Typography>

          <TextField
            fullWidth
            label="Wallet Address"
            value={activationAddress}
            onChange={(e) => {
              setActivationAddress(e.target.value);
              setActivationError("");
            }}
            error={Boolean(activationError)}
            helperText={activationError}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleActivateWallet}
            disabled={
              !activationAddress ||
              activating ||
              !walletAddressRegex.test(activationAddress)
            }
          >
            {activating ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Activating...</span>
              </Box>
            ) : (
              "Activate Wallet"
            )}
          </Button>
        </Paper>
      </Modal>

      <SuccessTx
        open={showSuccessTx}
        onClose={() => {
          setShowSuccessTx(false);
          onClose();
        }}
        txHash={activationTxHash}
      />
    </>
  );
};
