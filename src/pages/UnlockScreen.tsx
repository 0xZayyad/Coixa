import React, { useState } from "react";
import { Container, Stack, Typography, Paper, Box } from "@mui/material";
import { motion } from "framer-motion";
import { PinInput } from "../components/PinInput";
import { useLocation, Navigate } from "react-router-dom";
import { SecureStorage } from "../services/SecureStorage";
import { useWallet } from "../context/WalletContext";

export const UnlockScreen: React.FC = () => {
  const [error, setError] = useState("");
  const { unlockWallet } = useWallet();
  const location = useLocation();

  if (!SecureStorage.hasWallet()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const handleUnlock = async (pin: string) => {
    const success = await unlockWallet(pin);
    if (!success) {
      setError("Invalid PIN. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Typography variant="h6">Enter PIN</Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Enter your PIN to unlock your wallet
              </Typography>
              <Box sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
                <PinInput onComplete={handleUnlock} error={error} />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  );
};
