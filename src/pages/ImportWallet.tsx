import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { PiWallet } from "../wallet";
import { PinInput } from "../components/PinInput";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

type Step = "enter-phrase" | "create-pin" | "confirm-pin";

export const ImportWallet: React.FC = () => {
  const { importWallet } = useWallet();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("enter-phrase");
  const [phraseType, setPhraseType] = useState<12 | 24>(24);
  const [words, setWords] = useState<string[]>(Array(phraseType).fill(""));
  const [error, setError] = useState("");
  const [importedWallet, setImportedWallet] = useState<PiWallet | null>(null);
  const [pin, setPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [resetKey, setResetKey] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleWordChange = (index: number, value: string) => {
    if (index === 0) {
      // Check is pasting
      const pastedWords = value.trim().split(/\s+/);
      if (pastedWords.length === phraseType) {
        setWords(pastedWords);
        inputRefs.current[phraseType - 1]?.focus();
        setError("");
        return;
      }
    }
    const newWords = [...words];
    newWords[index] = value.toLowerCase().trim();
    setWords(newWords);

    // Auto-focus next input if word is entered
    if (
      (value.endsWith(" ") || value.endsWith("\n")) &&
      index < phraseType - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !words[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && words[index] && index < phraseType - 1) {
      // Move to next input on Enter if current word exists
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedWords = text.trim().split(/\s+/);

      if (pastedWords.length === phraseType) {
        setWords(pastedWords);
        inputRefs.current[phraseType - 1]?.focus();
        setError("");
      } else {
        setError(`Invalid mnemonic length. Expected ${phraseType} words.`);
      }
    } catch (err) {
      setError("Failed to read from clipboard.");
    }
  };

  const handleRestore = () => {
    const mnemonic = words.join(" ").trim();
    try {
      const wallet = PiWallet.fromMnemonic(mnemonic);
      setImportedWallet(wallet);
      setCurrentStep("create-pin");
      setError("");
    } catch (err) {
      setError(
        "Invalid recovery phrase. Please check your words and try again."
      );
    }
  };

  const handlePinCreated = (newPin: string) => {
    setPin(newPin);
    setResetKey((prev) => prev + 1); // Increment reset key to clear the field
    setCurrentStep("confirm-pin");
  };

  const handleImport = async (confirmPin: string) => {
    if (confirmPin !== pin) {
      setPinError("PINs do not match. Please try again.");
      setCurrentStep("create-pin");
      setPin("");
      setResetKey((prev) => prev + 1); // Increment reset key to clear the field
      return;
    }

    if (importedWallet) {
      try {
        await importWallet(importedWallet, pin);
      } catch (err) {
        setPinError("Failed to store wallet. Please try again.");
        setCurrentStep("create-pin");
        setPin("");
        setResetKey((prev) => prev + 1); // Increment reset key to clear the field
      }
    }
  };

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
            currentStep === "create-pin" ? handlePinCreated : handleImport
          }
          error={pinError}
          resetKey={resetKey}
        />
      </Box>
    </Stack>
  );

  const handlePhraseTypeChange = (
    _: React.SyntheticEvent,
    newValue: 12 | 24
  ) => {
    setPhraseType(newValue);
    setWords(Array(newValue).fill(""));
    setError("");
  };

  return (
    <Container maxWidth="lg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => {
                if (currentStep === "enter-phrase") {
                  navigate("/");
                } else if (currentStep === "create-pin") {
                  setCurrentStep("enter-phrase");
                  setImportedWallet(null);
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
            <Typography variant="h5">Import Wallet</Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              background:
                "linear-gradient(145deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.1) 100%)",
            }}
          >
            {currentStep === "enter-phrase" ? (
              <Stack spacing={3}>
                <Typography variant="h6" gutterBottom>
                  Enter Recovery Phrase
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your {phraseType}-word recovery phrase to restore your
                  wallet. Make sure you're in a secure environment.
                </Typography>

                <Tabs
                  value={phraseType}
                  onChange={handlePhraseTypeChange}
                  centered
                >
                  <Tab label="12-word Phrase" value={12} />
                  <Tab label="24-word Phrase" value={24} />
                </Tabs>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(3, 1fr)",
                      sm: "repeat(4, 1fr)",
                      md: "repeat(6, 1fr)",
                    },
                    gap: 1,
                  }}
                >
                  {words.map((word, index) => (
                    <TextField
                      key={index}
                      size="small"
                      value={word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      // label={`${index + 1}`}
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.paper",
                        },
                        border: error ? "1px solid red" : "none",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Tooltip title="Paste recovery phrase">
                    <IconButton onClick={handlePaste} size="large">
                      <ContentPasteIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRestore}
                    disabled={words.some((word) => !word)}
                    size="large"
                  >
                    Import Wallet
                  </Button>
                </Box>
              </Stack>
            ) : (
              renderPinSetup()
            )}
          </Paper>

          {error && currentStep === "enter-phrase" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
};
