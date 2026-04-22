import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "./auth";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => { login(data); navigate('/dashboard') },
  })
}
 
export const useRegister = () => {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => { login(data); navigate('/dashboard') },
  })
}
 