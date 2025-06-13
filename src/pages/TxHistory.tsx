import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Paper,
  Toolbar,
  Typography,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import History from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import type { Horizon } from "@stellar/stellar-sdk";
import { TransactionDetails } from "../components/TransactionDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PiTx } from "../wallet/PiApi";

const LIMIT = 10; // Number of transactions to fetch per request
const TxHistory: React.FC = () => {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PiTx[]>([]);
  const [selectedTx, setSelectedTx] = useState<PiTx | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextRecord, setNextRecord] = useState<
    (() => Promise<Horizon.ServerApi.CollectionPage<PiTx>>) | null
  >(null);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet]);

  const fetchTransactions = async (isNext: boolean = false) => {
    if (!wallet || loading) return;

    try {
      setLoading(true);
      setError(null);
      if (isNext) {
        if (!nextRecord) return;
        const res = await nextRecord();
        setTransactions((prev) => [...prev, ...res.records]);
        setNextRecord(() => res.next);
        setHasMore(res.records.length > LIMIT - 1);
      } else {
        const res = await wallet.payments(LIMIT);
        setTransactions(res.records);
        setHasMore(res.records.length > LIMIT - 1);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Could not fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (nextRecord && hasMore) {
      fetchTransactions(true);
    }
  };

  const renderTransactionIcon = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return paymentOp.from === wallet?.publicKey ? (
          <ArrowUpward />
        ) : (
          <CallReceivedIcon />
        );
      case "create_account":
        return <AccountBalanceWalletIcon />;
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

  if (!wallet) return null;

  return (
    <>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Transaction History
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ mt: 2, minHeight: "calc(100vh - 120px)" }}>
        <InfiniteScroll
          dataLength={transactions.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          }
          endMessage={
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ p: 2 }}
            >
              No more transactions
            </Typography>
          }
        >
          <List>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
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
                  onClick={() => setSelectedTx(tx)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: getTransactionColor(tx) }}>
                      {renderTransactionIcon(tx)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {getTransactionTitle(tx)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  {renderTransactionAmount(tx)}
                </ListItem>
                {index < transactions.length - 1 && (
                  <Box sx={{ width: "100%", px: 2 }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "1px",
                        bgcolor: "divider",
                      }}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </List>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}
        </InfiniteScroll>
      </Paper>

      {selectedTx && (
        <TransactionDetails
          open={Boolean(selectedTx)}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      )}
    </>
  );
};

export default TxHistory;
