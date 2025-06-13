import React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Button,
  Link,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useWallet } from "../context/WalletContext";
import { getExplorerUrl } from "../services/Market";
import type { Horizon } from "@stellar/stellar-sdk";

interface TransactionDetailsProps {
  open: boolean;
  onClose: () => void;
  transaction: Horizon.ServerApi.OperationRecord;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  open,
  onClose,
  transaction,
}) => {
  const { network, wallet } = useWallet();

  const renderAmount = () => {
    if (!transaction) return null;

    switch (transaction.type) {
      case "payment":
        const paymentOp =
          transaction as Horizon.ServerApi.PaymentOperationRecord;
        return `${paymentOp.from === wallet?.publicKey ? "-" : "+"}${
          paymentOp.amount
        } π`;
      case "create_account":
        const createOp =
          transaction as Horizon.ServerApi.CreateAccountOperationRecord;
        return `${createOp.starting_balance} π`;
      default:
        return "N/A";
    }
  };

  const renderDescription = () => {
    if (!transaction) return null;

    switch (transaction.type) {
      case "payment":
        const paymentOp =
          transaction as Horizon.ServerApi.PaymentOperationRecord;
        return paymentOp.from === wallet?.publicKey
          ? `Sent to ${paymentOp.to}`
          : `Received from ${paymentOp.from}`;
      case "create_account":
        const createOp =
          transaction as Horizon.ServerApi.CreateAccountOperationRecord;
        return `Account created by ${createOp.funder}`;
      default:
        return transaction.type.replace(/_/g, " ");
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "sticky" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Transaction Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {renderAmount()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, textTransform: "capitalize" }}
            >
              {transaction.type.replace(/_/g, " ")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Memo
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {(transaction as any).memo || "None"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, wordBreak: "break-all" }}>
              {renderDescription()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {new Date(transaction.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Transaction Hash
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, wordBreak: "break-all", fontFamily: "monospace" }}
            >
              {transaction.transaction_hash}
            </Typography>
          </Box>

          <Link
            href={getExplorerUrl(network, transaction.transaction_hash)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Button variant="outlined" fullWidth>
              View on Explorer
            </Button>
          </Link>
        </Stack>
      </Box>
    </Dialog>
  );
};
