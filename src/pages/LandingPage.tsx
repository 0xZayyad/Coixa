import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const MotionCard = motion(Card);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Stack spacing={4} alignItems="center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ p: 2 }}
          >
            Welcome to Coixa
          </Typography>
          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ mb: 4, p: 2 }}
          >
            The ultimate Pi wallet for all Pi network tools.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            width: "100%",
          }}
        >
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              cursor: "pointer",
              height: "250px",
              background:
                "linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
              "&:hover": {
                transform: "translateY(-5px)",
                transition: "transform 0.2s",
              },
            }}
            onClick={() => navigate("/import")}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <FileUploadIcon
                sx={{ fontSize: 48, mb: 2, color: "secondary.main" }}
              />
              <Typography variant="h5" gutterBottom>
                Import Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Restore your wallet using a recovery phrase
              </Typography>
            </CardContent>
          </MotionCard>
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              cursor: "pointer",
              height: "250px",
              background:
                "linear-gradient(145deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.1) 100%)",
              "&:hover": {
                transform: "translateY(-5px)",
                transition: "transform 0.2s",
              },
            }}
            onClick={() => navigate("/create")}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <AccountBalanceWalletIcon
                sx={{ fontSize: 48, mb: 2, color: "primary.main" }}
              />
              <Typography variant="h5" gutterBottom>
                Create New Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate a new wallet with a secure recovery phrase
              </Typography>
            </CardContent>
          </MotionCard>
        </Box>
      </Stack>
    </Container>
  );
};
