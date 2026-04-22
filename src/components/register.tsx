import { Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { useRegister } from "../api/auth-store/useAuth"
import { useState, type FormEvent } from "react"

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useRegister()
 
  const submit = (e: FormEvent) => {
    e.preventDefault()
    mutate({ name, email, password })
  }
 
  const errMsg = error
    ? (error as any).response?.data?.error ?? 'Erro ao criar conta'
    : null
 
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 bg-[#c8f135] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-[#080808]" fill="currentColor" />
          </div>
          <span className="text-[#f2f2f2] font-semibold text-lg tracking-tight">TaskAI</span>
        </div>
 
        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-8">
          <h1 className="text-[#f2f2f2] text-2xl font-semibold mb-1">Criar conta</h1>
          <p className="text-[#666] text-sm mb-8">Comece a organizar suas tarefas com IA</p>
 
          {errMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {errMsg}
            </div>
          )}
 
          <form onSubmit={submit} className="flex flex-col gap-4">
            {[
              { label: 'Nome', value: name, set: setName, type: 'text', placeholder: 'Seu nome' },
              { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'voce@email.com' },
              { label: 'Senha', value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
            ].map(({ label, value, set, type, placeholder }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[#9a9a9a] text-xs font-medium uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#f2f2f2] placeholder:text-[#444] focus:outline-none focus:border-[#c8f135]/40 focus:ring-1 focus:ring-[#c8f135]/10 transition-all"
                />
              </div>
            ))}
 
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 bg-[#c8f135] text-[#080808] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#b5dc25] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
        </div>
 
        <p className="text-center text-sm text-[#555] mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#c8f135] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}