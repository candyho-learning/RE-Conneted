import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import App from "@/App";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "@/components/Loading";

export default function ProtectedRoutes() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) return <Loading />;
  return isLoggedIn ? (
    <App />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
