
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("devhub_token");
  return token ? children : <Navigate to="/login" replace />;
}
