import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  Stack,
  Modal,
  Paper,
  Alert,
  ListItemButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import KeyIcon from "@mui/icons-material/Key";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useWallet } from "../context/WalletContext";
import { PiNetwork } from "../wallet/PiApi";
import { SecureStorage } from "../services/SecureStorage";
import { PinInput } from "./PinInput";
import { ActivateAccount } from "./ActivateAccount";

export const Settings: React.FC = () => {
  const { network, setNetwork, wallet } = useWallet();
  const [showBackup, setShowBackup] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pinResetKey, setPinResetKey] = useState(0);

  const handleNetworkChange = () => {
    setNetwork(
      network === PiNetwork.MAINNET ? PiNetwork.TESTNET : PiNetwork.MAINNET
    );
  };

  const handlePinSubmit = async (enteredPin: string) => {
    try {
      const walletData = await SecureStorage.getWallet(enteredPin);
      setMnemonic(walletData.mnemonic);
      setError("");
    } catch (err) {
      setError("Invalid PIN. Please try again.");
      setPinResetKey((prev) => prev + 1);
    }
  };

  const handleCopy = async () => {
    if (!mnemonic) return;
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCloseBackup = () => {
    setShowBackup(false);
    setMnemonic("");
    setError("");
    setPinResetKey((prev) => prev + 1);
  };

  return (
    <>
      {/* <Dialog fullScreen open={open} onClose={onClose}> */}
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => window.history.back()}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <List>
          <ListItem>
            <ListItemButton onClick={handleNetworkChange}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText
                primary="Test Network"
                secondary="Switch between mainnet and testnet"
              />
              <Switch
                edge="end"
                onChange={handleNetworkChange}
                checked={network === PiNetwork.TESTNET}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem onClick={() => setShowBackup(true)}>
            <ListItemButton>
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText
                primary="Backup Recovery Phrase"
                secondary="View your 24-word recovery phrase"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem onClick={() => setShowActivate(true)}>
            <ListItemButton disabled={!wallet?.IS_ACTIVATED}>
              <ListItemIcon>
                <AccountBalanceWalletIcon />
              </ListItemIcon>
              <ListItemText
                primary="Activate Wallet"
                secondary="Activate a new wallet by sending 1 π"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      {/* </Dialog> */}

      <Modal
        open={showBackup}
        onClose={handleCloseBackup}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ width: "90%", maxWidth: 500, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            View Recovery Phrase
          </Typography>
          {!mnemonic ? (
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Enter your PIN to view your recovery phrase
              </Typography>
              <PinInput
                onComplete={handlePinSubmit}
                error={error}
                resetKey={pinResetKey}
              />
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Alert severity="warning">
                Never share your recovery phrase with anyone. Anyone with these
                words can access your funds.
              </Alert>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  position: "relative",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                }}
              >
                {mnemonic}
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                >
                  {copied ? (
                    <CheckIcon sx={{ color: "success.main" }} />
                  ) : (
                    <ContentCopyIcon />
                  )}
                </IconButton>
              </Paper>
              <Button variant="contained" onClick={handleCloseBackup} fullWidth>
                Done
              </Button>
            </Stack>
          )}
        </Paper>
      </Modal>

      <ActivateAccount
        open={showActivate}
        onClose={() => setShowActivate(false)}
        wallet={wallet}
      />
    </>
  );
};
