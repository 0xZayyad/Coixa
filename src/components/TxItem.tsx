import { Avatar, Box, ListItem, Typography } from "@mui/material";
import React from "react";
import type { PiTx } from "../wallet/PiApi";
import type { Horizon } from "@stellar/stellar-sdk";
import {
  AccountBalanceWallet,
  ArrowUpward,
  CallReceived,
  History,
} from "@mui/icons-material";
import { useWallet } from "../context/WalletContext";

interface Props {
  tx: PiTx;
  onSelect?: (tx: PiTx) => void;
}
const TxItem: React.FC<Props> = ({ tx, onSelect }) => {
  const { wallet } = useWallet();

  const renderTransactionIcon = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return paymentOp.from === wallet?.publicKey ? (
          <ArrowUpward />
        ) : (
          <CallReceived />
        );
      case "create_account":
        return <AccountBalanceWallet />;
      default:
        return <History />;
    }
  };

  const getTransactionTitle = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return paymentOp.from === wallet?.publicKey
          ? `To: ${paymentOp.to.slice(0, 4)}....${paymentOp.to.slice(-4)}`
          : `From: ${paymentOp.from.slice(0, 4)}....${paymentOp.from.slice(
              -4
            )}`;
      case "create_account":
        const createOp = tx as Horizon.ServerApi.CreateAccountOperationRecord;
        const initial =
          createOp.funder === wallet?.publicKey ? "Funded" : "Created by";
        return `${initial} ${createOp.funder.slice(
          0,
          4
        )}....${createOp.funder.slice(-4)}`;
      default:
        return tx.type.replace(/_/g, " ");
    }
  };

  const renderTransactionAmount = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return (
          <Typography
            variant="subtitle2"
            color={
              paymentOp.from === wallet?.publicKey
                ? "error.main"
                : "success.main"
            }
            sx={{ fontWeight: "bold" }}
          >
            {paymentOp.from === wallet?.publicKey ? "-" : "+"}
            {Number(parseFloat(paymentOp.amount).toFixed(4)).toLocaleString()} π
          </Typography>
        );
      case "create_account":
        const createOp = tx as Horizon.ServerApi.CreateAccountOperationRecord;
        return (
          <Typography
            variant="subtitle2"
            color="info.main"
            sx={{ fontWeight: "bold" }}
          >
            {createOp.funder === wallet?.publicKey ? "-" : "+"}
            {Number(
              parseFloat(createOp.starting_balance).toFixed(4)
            ).toLocaleString()}{" "}
            π
          </Typography>
        );
      default:
        return (
          <Typography variant="subtitle2" color="text.primary">
            N/A
          </Typography>
        );
    }
  };

  const getTransactionColor = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return paymentOp.from === wallet?.publicKey
          ? "error.main"
          : "success.main";
      case "create_account":
        return "info.main";
      default:
        return "text.primary";
    }
  };
  return (
    <ListItem
      sx={{
        py: 2,
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={() => onSelect?.(tx)}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: getTransactionColor(tx) }}>
          {renderTransactionIcon(tx)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{getTransactionTitle(tx)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(tx.created_at).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      {renderTransactionAmount(tx)}
    </ListItem>
  );
};

export default TxItem;
