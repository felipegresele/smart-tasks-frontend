import { useState, type FormEvent } from 'react'
import { Sparkles, Plus, X, Loader2 } from 'lucide-react'
import type { AiSuggestedTask, Priority } from '../../schema'
import { useCreateTask, useSuggestTasks } from '../../api/useTasks'


const PRIORITY_STYLES: Record<Priority, string> = {
  HIGH:   'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LOW:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa',
}

export default function AiInput() {
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<AiSuggestedTask[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const suggest = useSuggestTasks()
  const createTask = useCreateTask()

  const handleSuggest = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    suggest.mutate(text, {
      onSuccess: (data) => {
        setSuggestions(data)
        setSelected(new Set(data.map((_, i) => i)))
      },
    })
  }

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const addSelected = async () => {
    const toAdd = suggestions.filter((_, i) => selected.has(i))
    await Promise.all(toAdd.map((t) => createTask.mutateAsync({ title: t.title, description: t.description, priority: t.priority, status: 'TODO' })))
    setSuggestions([])
    setSelected(new Set())
    setText('')
  }

  const clear = () => { setSuggestions([]); setSelected(new Set()); setText('') }

  return (
    <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#c8f135]/10 rounded-md flex items-center justify-center">
          <Sparkles size={13} className="text-[#c8f135]" />
        </div>
        <span className="text-[#f2f2f2] text-sm font-medium">Gerar tarefas com IA</span>
      </div>

      {/* Input */}
      <form onSubmit={handleSuggest} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Organizar meu dia de estudos e trabalho..."
          className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#f2f2f2] placeholder:text-[#444] focus:outline-none focus:border-[#c8f135]/40 transition-all"
        />
        <button
          type="submit"
          disabled={suggest.isPending || !text.trim()}
          className="bg-[#c8f135] text-[#080808] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b5dc25] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
        >
          {suggest.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {suggest.isPending ? 'Gerando...' : 'Gerar'}
        </button>
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#666] text-xs">Selecione as tarefas para adicionar</p>
            <button onClick={clear} className="text-[#444] hover:text-[#f2f2f2] transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {suggestions.map((t, i) => (
              <button
                key={i}
                onClick={() => toggleSelect(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selected.has(i)
                    ? 'bg-[#c8f135]/5 border-[#c8f135]/25'
                    : 'bg-[#161616] border-[#222] opacity-50'
                }`}
              >
                {/* checkbox */}
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  selected.has(i) ? 'bg-[#c8f135] border-[#c8f135]' : 'border-[#333]'
                }`}>
                  {selected.has(i) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#f2f2f2] text-sm font-medium truncate">{t.title}</p>
                  {t.description && <p className="text-[#555] text-xs mt-0.5 line-clamp-1">{t.description}</p>}
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${PRIORITY_STYLES[t.priority]}`}>
                  {PRIORITY_LABELS[t.priority]}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={addSelected}
            disabled={selected.size === 0 || createTask.isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#c8f135] text-[#080808] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#b5dc25] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={15} />
            Adicionar {selected.size} tarefa{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}