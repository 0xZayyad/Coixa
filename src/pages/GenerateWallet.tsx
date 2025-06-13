import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  Container,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import { motion } from "framer-motion";
import { PiWallet } from "../wallet";
import { Grid as MuiGrid } from "@mui/material";
import { PinInput } from "../components/PinInput";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

type Step =
  | "initial"
  | "show-mnemonic"
  | "backup-options"
  | "create-pin"
  | "confirm-pin";

/*interface Props {
  onWalletCreated?: (wallet: PiWallet) => void;
}*/

export const GenerateWallet: React.FC = () => {
  const { createWallet } = useWallet();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("initial");
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [resetKey, setResetKey] = useState<number>(0);

  const handleGenerate = () => {
    const newWallet = PiWallet.generate();
    setWallet(newWallet);
    setCurrentStep("show-mnemonic");
  };

  const handleCopy = async () => {
    try {
      if (wallet) {
        await navigator.clipboard.writeText(wallet.mnemonic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleContinueToBackup = () => {
    setCurrentStep("backup-options");
  };

  const handleBackupOption = async (option: "google-drive" | "skip") => {
    if (option === "google-drive") {
      // Google Drive integration will be handled later
      if (wallet) {
        setCurrentStep("create-pin");
      }
    } else {
      setCurrentStep("create-pin");
    }
  };

  const handlePinCreated = (newPin: string) => {
    setPin(newPin);
    setResetKey((prev) => prev + 1); // Increment reset key to clear the field
    setCurrentStep("confirm-pin");
  };

  const handlePinConfirmed = async (confirmPin: string) => {
    if (confirmPin !== pin) {
      setPinError("PINs do not match. Please try again.");
      setCurrentStep("create-pin");
      setPin("");
      setResetKey((prev) => prev + 1);
      return;
    }

    if (wallet) {
      try {
        await createWallet(wallet, pin);
      } catch (err) {
        setPinError("Failed to store wallet. Please try again.");
        setCurrentStep("create-pin");
        setPin("");
        setResetKey((prev) => prev + 1);
      }
    }
  };

  const renderMnemonicWords = (mnemonic: string) => {
    const words = mnemonic.split(" ");
    return (
      <MuiGrid container spacing={1}>
        {words.map((word, index) => (
          <MuiGrid size={{ xs: 4, sm: 3, md: 2 }} key={index}>
            <Paper
              sx={{
                p: 1,
                textAlign: "center",
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", minWidth: "20px" }}
              >
                {index + 1}.
              </Typography>
              <Typography variant="body2">{word}</Typography>
            </Paper>
          </MuiGrid>
        ))}
      </MuiGrid>
    );
  };

  const renderBackupOptions = () => (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        Choose Backup Method
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Select how you want to backup your wallet recovery phrase
      </Typography>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
        <Card
          sx={{
            cursor: "pointer",
            "&:hover": { transform: "translateY(-4px)", transition: "0.2s" },
          }}
          onClick={() => handleBackupOption("google-drive")}
        >
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <GoogleIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="h6">Google Drive</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Securely store in your Google Drive (Recommended)
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            cursor: "pointer",
            "&:hover": { transform: "translateY(-4px)", transition: "0.2s" },
          }}
          onClick={() => handleBackupOption("skip")}
        >
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <LockIcon sx={{ fontSize: 40, color: "secondary.main" }} />
              <Typography variant="h6">Skip</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                I've saved my recovery phrase securely
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );

  const renderPinSetup = () => (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h6">
        {currentStep === "create-pin" ? "Create PIN" : "Confirm PIN"}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {currentStep === "create-pin"
          ? "Create a 6-digit PIN to secure your wallet"
          : "Enter the PIN again to confirm"}
      </Typography>

      <Box sx={{ mt: 4, width: "100%", maxWidth: 400 }}>
        <PinInput
          onComplete={
            currentStep === "create-pin" ? handlePinCreated : handlePinConfirmed
          }
          error={pinError}
          resetKey={resetKey}
        />
      </Box>
    </Stack>
  );

  return (
    <Container maxWidth="lg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => {
                if (currentStep === "initial") {
                  navigate("/");
                } else if (currentStep === "show-mnemonic") {
                  setCurrentStep("initial");
                  setWallet(null);
                } else if (currentStep === "backup-options") {
                  setCurrentStep("show-mnemonic");
                } else if (currentStep === "create-pin") {
                  setCurrentStep("backup-options");
                } else if (currentStep === "confirm-pin") {
                  setCurrentStep("create-pin");
                  setPin("");
                  setPinError("");
                }
              }}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">Create New Wallet</Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              background:
                "linear-gradient(145deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.1) 100%)",
            }}
          >
            {currentStep === "initial" && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Generate a New Wallet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 600, mx: "auto" }}
                >
                  This will create a new wallet with a 24-word recovery phrase.
                  Make sure to store your recovery phrase in a safe place - it's
                  the only way to restore your wallet if you lose access.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleGenerate}
                >
                  Generate Wallet
                </Button>
              </Box>
            )}

            {currentStep === "show-mnemonic" && wallet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Your Recovery Phrase</Typography>
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton onClick={handleCopy} size="small">
                        {copied ? (
                          <CheckIcon sx={{ color: "success.main" }} />
                        ) : (
                          <ContentCopyIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    Warning: Never share your recovery phrase with anyone!
                  </Typography>
                  {renderMnemonicWords(wallet.mnemonic)}

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleContinueToBackup}
                    >
                      I've Saved My Recovery Phrase
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {currentStep === "backup-options" && renderBackupOptions()}
            {(currentStep === "create-pin" || currentStep === "confirm-pin") &&
              renderPinSetup()}
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  );
};
