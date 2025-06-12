import React from "react";
import { useWallet } from "../context/WalletContext";
import { Navigate, Outlet } from "react-router-dom";
import { SecureStorage } from "../services/SecureStorage";

const ProtectedRoutes: React.FC = () => {
  const { wallet } = useWallet();
  const hasWallet = SecureStorage.hasWallet();

  return hasWallet ? (
    wallet ? (
      <Outlet />
    ) : (
      <Navigate to={"/unlock"} />
    )
  ) : (
    <Navigate to={"/"} />
  );
};

export default ProtectedRoutes;
