// import type { Horizon } from "@stellar/stellar-sdk";
// import type { PiWallet } from "../wallet/types";

// const renderTransactionIcon = (wallet: PiWallet, tx: Horizon.ServerApi.OperationRecord) => {
//     switch (tx.type) {
//       case "payment":
//         const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
//         return paymentOp.from === wallet?.publicKey ? (
//           <ArrowUpward />
//         ) : (
//           <CallReceivedIcon />
//         );
//       case "create_account":
//         return <AccountBalanceWalletIcon />;
//       default:
//         return <History />;
//     }
//   };

//   const getTransactionTitle = (tx: Horizon.ServerApi.OperationRecord) => {
//     switch (tx.type) {
//       case "payment":
//         const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
//         return paymentOp.from === wallet?.publicKey
//           ? `To: ${paymentOp.to.slice(0, 4)}....${paymentOp.to.slice(-4)}`
//           : `From: ${paymentOp.from.slice(0, 4)}....${paymentOp.from.slice(-4)}`;
//       case "create_account":
//         const createOp = tx as Horizon.ServerApi.CreateAccountOperationRecord;
//         const initial = createOp.funder === wallet?.publicKey ? "Funded" : "Created by";
//         return `${initial} ${createOp.funder.slice(0, 4)}....${createOp.funder.slice(-4)}`;
//       default:
//         return tx.type.replace(/_/g, " ");
//     }
//   };

//   const renderTransactionAmount = (tx: Horizon.ServerApi.OperationRecord) => {
//     switch (tx.type) {
//       case "payment":
//         const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
//         return (
//           <Typography
//             variant="subtitle2"
//             color={paymentOp.from === wallet?.publicKey ? "error.main" : "success.main"}
//             sx={{ fontWeight: "bold" }}
//           >
//             {paymentOp.from === wallet?.publicKey ? "-" : "+"}
//             {Number(parseFloat(paymentOp.amount).toFixed(4)).toLocaleString()} π
//           </Typography>
//         );
//       case "create_account":
//         const createOp = tx as Horizon.ServerApi.CreateAccountOperationRecord;
//         return (
//           <Typography variant="subtitle2" color="info.main" sx={{ fontWeight: "bold" }}>
//             {createOp.funder === wallet?.publicKey ? "-" : "+"}
//             {Number(parseFloat(createOp.starting_balance).toFixed(4)).toLocaleString()} π
//           </Typography>
//         );
//       default:
//         return (
//           <Typography variant="subtitle2" color="text.primary">
//             N/A
//           </Typography>
//         );
//     }
//   };

//   const getTransactionColor = (tx: Horizon.ServerApi.OperationRecord) => {
//     switch (tx.type) {
//       case "payment":
//         const paymentOp = tx as Horizon.ServerApi.PaymentOperationRecord;
//         return paymentOp.from === wallet?.publicKey ? "error.main" : "success.main";
//       case "create_account":
//         return "info.main";
//       default:
//         return "text.primary";
//     }
//   };
