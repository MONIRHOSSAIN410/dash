import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext.jsx";
import useSmoothScroll from "./hooks/useSmoothScroll.js";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reports from "./pages/Reports.jsx";
import Loader from "./components/Loader.jsx";

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader full />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  useSmoothScroll();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname === "/login" ? "login" : "app"}>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Private>
              <Layout />
            </Private>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
