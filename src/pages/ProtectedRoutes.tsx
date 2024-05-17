import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import App from "@/App";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoutes() {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  return isLoggedIn ? (
    <App />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
