import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import type { Horizon } from "@stellar/stellar-sdk";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PiTx } from "../wallet/PiApi";
import TxList from "../components/TxList";

const LIMIT = 10; // Number of transactions to fetch per request
const TxHistory: React.FC = () => {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PiTx[]>([]);
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
  if (!wallet) return null;

  return (
    <>
      <AppBar sx={{ position: "sticky" }}>
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
          <TxList txs={transactions} />
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}
        </InfiniteScroll>
      </Paper>
    </>
  );
};

export default TxHistory;
