import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  DialogActions,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { PinInput } from "./PinInput";
import { SecureStorage } from "../services/SecureStorage";

interface ConfirmPinProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmPin: React.FC<ConfirmPinProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Enter PIN",
  description = "Please enter your PIN to continue",
}) => {
  const [error, setError] = useState("");
  const [pinResetKey, setPinResetKey] = useState(0);

  const handlePinSubmit = async (pin: string) => {
    try {
      await SecureStorage.getWallet(pin);
      onConfirm();
      onClose();
    } catch (err) {
      setError("Invalid PIN. Please try again.");
      setPinResetKey((prev) => prev + 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            gutterBottom
          >
            {description}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <PinInput
              onComplete={handlePinSubmit}
              error={error}
              resetKey={pinResetKey}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
