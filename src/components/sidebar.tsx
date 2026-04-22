import { LogOut, Zap, LayoutDashboard, CheckSquare } from 'lucide-react'
import { useTaskStats } from '../api/useTasks'
import { useAuthStore } from '../api/authStore'

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { data: stats } = useTaskStats()

  const progress = stats && stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0

  return (
    <aside className="w-60 shrink-0 bg-[#0a0a0a] border-r border-[#161616] flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#161616]">
        <div className="w-7 h-7 bg-[#c8f135] rounded-lg flex items-center justify-center shrink-0">
          <Zap size={14} className="text-[#080808]" fill="currentColor" />
        </div>
        <span className="text-[#f2f2f2] font-semibold text-base tracking-tight">TaskAI</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#c8f135]/8 text-[#c8f135]">
          <LayoutDashboard size={16} />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#555] hover:text-[#9a9a9a] hover:bg-[#161616] cursor-pointer transition-colors">
          <CheckSquare size={16} />
          <span className="text-sm">Minhas Tarefas</span>
        </div>
      </nav>

      {/* Stats */}
      <div className="mx-3 mt-2 bg-[#111] border border-[#1c1c1c] rounded-xl p-4">
        <p className="text-[#555] text-xs font-medium uppercase tracking-wider mb-4">Progresso</p>

        <div className="flex flex-col gap-2.5 mb-4">
          {[
            { label: 'A fazer',      value: stats?.todo  ?? 0, color: 'bg-[#333]' },
            { label: 'Em andamento', value: stats?.doing ?? 0, color: 'bg-blue-400' },
            { label: 'Concluído',    value: stats?.done  ?? 0, color: 'bg-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-[#666] text-xs">{label}</span>
              </div>
              <span className="text-[#9a9a9a] text-xs font-mono">{value}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c8f135] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[#555] text-xs font-mono w-8 text-right">{progress}%</span>
        </div>
      </div>

      {/* User */}
      <div className="mt-auto px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#161616] transition-colors group">
          <div className="w-7 h-7 bg-[#c8f135]/15 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#c8f135] text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#f2f2f2] text-sm font-medium truncate">{user?.name}</p>
            <p className="text-[#444] text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 transition-all"
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}