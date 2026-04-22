import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./components/login"
import Register from "./components/register"
import Dashboard from "./components/dashboard"
import { useAuthStore } from "./api/auth-store/authStore"

const Protected = ({ children }: { children: React.ReactNode }) => {
  const ok = useAuthStore((s) => s.isAuthenticated)
  return ok ? <>{children}</> : <Navigate to="/login" replace />
}
 
const Public = ({ children }: { children: React.ReactNode }) => {
  const ok = useAuthStore((s) => s.isAuthenticated)
  return !ok ? <>{children}</> : <Navigate to="/dashboard" replace />
}
 
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Public><Login /></Public>} />
        <Route path="/register" element={<Public><Register /></Public>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
 