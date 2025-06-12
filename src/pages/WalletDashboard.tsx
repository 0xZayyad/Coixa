import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Button,
  Container,
  Modal,
  List,
  ListItem,
  Avatar,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import { Refresh, ArrowUpward, Add, History } from "@mui/icons-material";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "../components/QRCode";
import { SendTransaction } from "../components/SendTransaction";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import QuickAction from "../components/QuickAction";
import { fetchPiPrice } from "../services/Market";
import type { Horizon } from "@stellar/stellar-sdk";
import { PiNetwork } from "../wallet/PiApi";
import { Settings } from "../components/Settings";
import { TransactionDetails } from "../components/TransactionDetails";

export const WalletDashboard: React.FC = () => {
  const { wallet, network, logout } = useWallet();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketPrice, setMarketPrice] = useState<{
    price: number;
    change24h: number;
  }>({ price: 1, change24h: 0 });
  const [transactions, setTransactions] =
    useState<
      Horizon.ServerApi.CollectionPage<
        | Horizon.ServerApi.PaymentOperationRecord
        | Horizon.ServerApi.CreateAccountOperationRecord
        | Horizon.ServerApi.AccountMergeOperationRecord
        | Horizon.ServerApi.PathPaymentOperationRecord
        | Horizon.ServerApi.PathPaymentStrictSendOperationRecord
        | Horizon.ServerApi.InvokeHostFunctionOperationRecord
      >
    >();
  const [selectedTx, setSelectedTx] =
    useState<Horizon.ServerApi.OperationRecord | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await fetchPiPrice();
      setMarketPrice(price);
      return price;
    };
    if (!wallet) {
      navigate("/");
    } else {
      fetchAccountDetails();
      fetchPrice();
    }
    console.log(wallet?.IS_ACTIVATED);
  }, [wallet, navigate]);

  const fetchAccountDetails = async () => {
    if (!wallet) return;
    console.log("Loading...");
    try {
      setLoading(true);
      setError(null);
      await wallet.loadAccount();
      const txs = await wallet.payments();
      setTransactions(txs);
      console.log(txs);
      console.log(wallet.account);
    } catch (error) {
      console.error("Error fetching account details:", error);
      setError("Could not fetch account details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!wallet) return;

    try {
      await navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleShare = async () => {
    await navigator.share({ text: wallet?.publicKey });
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

  const renderTransactionAmount = (tx: Horizon.ServerApi.OperationRecord) => {
    switch (tx.type) {
      case "payment":
        const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
        return (
          <>
            {paymentOp.from === wallet?.publicKey ? "-" : "+"}
            {Number(parseFloat(paymentOp.amount).toFixed(4)).toLocaleString()} π
          </>
        );
      case "create_account":
        const createOp = tx as Horizon.ServerApi.CreateAccountOperationRecord;
        return (
          <>
            {createOp.funder === wallet?.publicKey ? "-" : "+"}$
            {Number(
              parseFloat(createOp.starting_balance).toFixed(4)
            ).toLocaleString()}{" "}
            π
          </>
        );
      default:
        return "N/A";
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

  // if (loading) return <LinearProgress />;
  if (!wallet) {
    return null;
  }
  const marketUp = useMemo(() => marketPrice.change24h >= 0, [marketPrice]);
  return (
    <Container maxWidth="xl">
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
              <Typography variant="h5">Quantra</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Settings">
                <IconButton
                  onClick={() => setShowSettings(true)}
                  color="inherit"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: { sm: 1, xl: 4 },
            }}
          >
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  p: 1,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  fontFamily: "monospace",
                }}
              >
                {wallet.publicKey.slice(0, 5)}....
                {wallet.publicKey.slice(
                  wallet.publicKey.length - 5,
                  wallet.publicKey.length
                )}
                <Tooltip title={copied ? "Copied!" : "Copy Address"}>
                  <IconButton size="small" onClick={handleCopy}>
                    {copied ? (
                      <CheckIcon sx={{ color: "success.main" }} />
                    ) : (
                      <ContentCopyIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Typography>
              <IconButton onClick={fetchAccountDetails}>
                <Refresh />
              </IconButton>
            </Stack>
            <Stack spacing={2}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                error && (
                  <>
                    {!wallet.IS_ACTIVATED && (
                      <Alert
                        severity="warning"
                        sx={{
                          mb: 2,
                          "& .MuiAlert-message": {
                            width: "100%",
                          },
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Wallet Not Activated
                        </Typography>
                        <Typography variant="body2">
                          Your wallet needs to be activated by the Pi Network.
                          Ensure you passed KYC. This is required by the Pi
                          Network to prevent spam accounts.
                        </Typography>
                      </Alert>
                    )}
                  </>
                )
              )}
              <Box width={"100%"} textAlign="center">
                <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                  ${" "}
                  {(wallet.balance ? wallet.balance * marketPrice.price : 0)
                    .toFixed(2)
                    .toLocaleString() || "0"}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {wallet.balance?.toFixed(4) || "0"} π
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: marketUp ? "success.main" : "error.main",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      opacity: 0.8,
                    }}
                  >
                    {marketUp ? (
                      <ArrowDropUpIcon
                        fontSize="small"
                        sx={{ color: "white" }}
                      />
                    ) : (
                      <ArrowDropDownIcon
                        fontSize="small"
                        sx={{ color: "white" }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      {`${Math.abs(marketPrice.price).toFixed(2)}π(${
                        marketUp ? "+" : "-"
                      }${Math.abs(marketPrice.change24h).toFixed(2)}%)`}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyItems: "center",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <QuickAction
                icon={<SendIcon />}
                slotProps={{
                  IconButton: {
                    disabled: !wallet.balance || loading,
                  },
                }}
                label="Send"
                onClick={() => setShowSend(true)}
              />
              <QuickAction
                icon={<QrCode2Icon />}
                label="Receive"
                onClick={() => setShowQR(true)}
              />
              {network === PiNetwork.TESTNET && (
                <QuickAction
                  icon={<Add />}
                  label="Airdrop"
                  onClick={handleShare}
                />
              )}
            </Stack>
          </Paper>
          {error && (
            <Alert severity="info">
              We're having issues fetching your account. Rest assured your funds
              are safe!
            </Alert>
          )}
          <Paper elevation={3} sx={{ px: { sm: 1.5, lg: 3 }, py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : transactions && transactions.records.length > 0 ? (
              <List>
                {transactions.records.slice(0, 5).map((tx, index) => (
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
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
                      <Typography
                        variant="subtitle2"
                        color={getTransactionColor(tx)}
                        sx={{ fontWeight: "bold" }}
                      >
                        {renderTransactionAmount(tx)}
                      </Typography>
                    </ListItem>
                    {index < transactions.records.length - 1 && (
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
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No transactions yet
                </Typography>
              </Box>
            )}
          </Paper>

          <Modal
            open={showQR}
            onClose={() => setShowQR(false)}
            aria-labelledby="qr-code-modal"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Paper
                  elevation={24}
                  sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    maxWidth: "90vw",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Scan QR Code
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <QRCode value={wallet.publicKey} size={250} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: "break-all",
                      mt: 2,
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      fontFamily: "monospace",
                    }}
                  >
                    {wallet.publicKey}
                    <Tooltip title={copied ? "Copied!" : "Copy Address"}>
                      <IconButton size="small" onClick={handleCopy}>
                        {copied ? (
                          <CheckIcon sx={{ color: "success.main" }} />
                        ) : (
                          <ContentCopyIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Stack justifyContent={"flex-end"}>
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ py: 2 }}
                    onClick={handleShare}
                  >
                    Save
                  </Button>
                </Paper>
              </motion.div>
            </AnimatePresence>
          </Modal>

          <Modal
            open={showSend}
            onClose={() => setShowSend(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 600, m: 2 }}>
              <Paper
                sx={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}
              >
                <SendTransaction
                  wallet={wallet}
                  balance={wallet.balance || "0"}
                  onClose={() => {
                    setShowSend(false);
                    fetchAccountDetails();
                  }}
                />
              </Paper>
            </Box>
          </Modal>

          <Settings
            open={showSettings}
            onClose={() => setShowSettings(false)}
          />

          {selectedTx && (
            <TransactionDetails
              open={Boolean(selectedTx)}
              onClose={() => setSelectedTx(null)}
              transaction={selectedTx}
            />
          )}
        </Stack>
      </Box>
    </Container>
  );
};
