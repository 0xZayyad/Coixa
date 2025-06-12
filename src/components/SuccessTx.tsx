import React from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";
import { useWallet } from "../context/WalletContext";
import { getExplorerUrl } from "../services/Market";

interface SuccessTxProps {
  open: boolean;
  onClose: () => void;
  txHash: string;
}

export const SuccessTx: React.FC<SuccessTxProps> = ({
  open,
  onClose,
  txHash,
}) => {
  const { network } = useWallet();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Transaction Success
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          height: "100%",
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 100, color: "success.main", mb: 3 }}
          />
        </motion.div>

        <Typography variant="h5" gutterBottom>
          Transaction Successful!
        </Typography>

        <Stack spacing={2} sx={{ mt: 4, width: "100%", maxWidth: 400 }}>
          <Typography variant="subtitle2" color="text.secondary" align="center">
            Transaction Hash:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {txHash}
            </Typography>
            <IconButton onClick={handleCopy} size="small">
              <ContentCopyIcon
                sx={{ color: copied ? "success.main" : "inherit" }}
              />
            </IconButton>
          </Box>

          <Link
            href={getExplorerUrl(network, txHash)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View on Explorer
            </Button>
          </Link>

          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Done
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
