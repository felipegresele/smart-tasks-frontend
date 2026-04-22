import { api } from "."
import type { AuthResponse, LoginRequest, RegisterRequest } from "../schema"

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data)
    return res.data
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data)
    return res.data
  },
}
 