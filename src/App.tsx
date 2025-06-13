import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme";
import { LandingPage } from "./pages/LandingPage";
import { ImportWallet } from "./pages/ImportWallet";
import { GenerateWallet } from "./pages/GenerateWallet";
import { WalletDashboard } from "./pages/WalletDashboard";
import { UnlockScreen } from "./pages/UnlockScreen";
import { WalletProvider } from "./context/WalletContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import TestnetAlert from "./components/TestnetAlert";
import { Settings } from "./pages/Settings";
import TxHistory from "./pages/TxHistory";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <WalletProvider>
          <TestnetAlert />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<GenerateWallet />} />
            <Route path="/import" element={<ImportWallet />} />
            <Route path="/unlock" element={<UnlockScreen />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<WalletDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<TxHistory />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WalletProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
