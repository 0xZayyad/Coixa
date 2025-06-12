import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  Modal,
  Paper,
  InputAdornment,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { PiWallet } from "../wallet";
import { SuccessTx } from "./SuccessTx";

interface SendTransactionProps {
  wallet: PiWallet;
  balance: string | number;
  onClose: () => void;
}

const walletRegex = /^G[A-Z2-7]{55}$/;
const PI_NETWORK_FEE = 0.01;

export const SendTransaction: React.FC<SendTransactionProps> = ({
  wallet,
  balance,
  onClose,
}) => {
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [memo, setMemo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const availableBalance =
    typeof balance == "string" ? parseFloat(balance) : balance;

  const handleMax = () =>
    setAmount((availableBalance - PI_NETWORK_FEE).toString());

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDestinationAddress(text);
      setAddressError(!walletRegex.test(text.trim()));
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const handleSend = async () => {
    if (!amount || !destinationAddress) return;

    try {
      setSending(true);
      setError(null);
      const result = await wallet.sendTransaction(
        destinationAddress,
        amount,
        memo
      );
      setTxHash(result.hash);
      setShowSuccess(true);
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("Failed to send transaction. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleScanResult = (results: IDetectedBarcode[]) => {
    setDestinationAddress(results[0].rawValue.trim());
    setAddressError(!walletRegex.test(results[0].rawValue.trim()));
    setShowScanner(false);
  };

  const isSendDisabled = useMemo(
    () =>
      !amount ||
      !destinationAddress ||
      addressError ||
      parseFloat(amount) <= 0 ||
      parseFloat(amount) + PI_NETWORK_FEE > availableBalance ||
      sending,
    [amount, destinationAddress, addressError, availableBalance, sending]
  );

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 12, minHeight: "80vh" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography variant="h6">Send π</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Amount Input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon
                  sx={{
                    fontSize: "2.5rem",
                    color:
                      parseFloat(amount) > availableBalance
                        ? "error.main"
                        : "primary.main",
                  }}
                />
                <input
                  type="text"
                  value={amount}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9.]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  placeholder="0.00"
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 600,
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "inherit",
                  }}
                />
              </Box>

              {parseFloat(amount) > availableBalance && (
                <Typography variant="body2" color="error">
                  Insufficient balance
                </Typography>
              )}
            </Box>

            <Button
              onClick={handleMax}
              sx={{ ml: 2, textTransform: "none", fontWeight: 500 }}
            >
              Max
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 4 }}
          >
            Available: {availableBalance.toFixed(2)} π
          </Typography>

          {/* Destination Address Input */}
          <TextField
            variant="outlined"
            placeholder="Recipient address"
            value={destinationAddress}
            onChange={(e) => {
              setDestinationAddress(e.target.value);
              setAddressError(!walletRegex.test(e.target.value.trim()));
            }}
            fullWidth
            error={addressError}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowScanner(true)}
                      sx={{ mr: 1 }}
                    >
                      <QrCode2Icon />
                    </IconButton>
                    <IconButton onClick={handlePaste}>
                      <ContentPasteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            sx={{ mt: 2 }}
            label="Memo (Optional)"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Memo(Optional)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            fullWidth
          />
          {addressError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Invalid wallet address
            </Typography>
          )}

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* Bottom Bar */}
        <Paper
          elevation={4}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            px: 3,
            py: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={1} mb={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Network fee:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {PI_NETWORK_FEE} π
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Total:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {(parseFloat(amount || "0") + PI_NETWORK_FEE).toFixed(2)} π
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSend}
            disabled={isSendDisabled}
            sx={{ fontWeight: 600 }}
          >
            {sending ? "Sending..." : "Send π"}
          </Button>
        </Paper>

        {/* QR Scanner Modal */}
        <Modal
          open={showScanner}
          onClose={() => setShowScanner(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence>
            <Box
              component={motion.div}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              sx={{ width: "90%", maxWidth: 500 }}
            >
              <Paper sx={{ p: 3, position: "relative" }}>
                <IconButton
                  onClick={() => setShowScanner(false)}
                  sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Scan QR Code
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Scanner
                    onScan={(result: IDetectedBarcode[]) =>
                      handleScanResult(result)
                    }
                    onError={(error: any) => console.error(error)}
                  />
                </Box>
              </Paper>
            </Box>
          </AnimatePresence>
        </Modal>
      </Box>
      <SuccessTx
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        txHash={txHash}
      />
    </>
  );
};
