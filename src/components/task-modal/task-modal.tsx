import { useEffect, useState, type FormEvent } from "react"
import { useCreateTask, useUpdateTask } from "../../api/useTasks"
import type { Priority, Task, TaskStatus } from "../../schema"
import { X } from "lucide-react"

interface Props {
  onClose: () => void
  editTask?: Task | null
  defaultStatus?: TaskStatus
}
 
export default function TaskModal({ onClose, editTask, defaultStatus = 'TODO' }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
 
  const create = useCreateTask()
  const update = useUpdateTask()
  const isPending = create.isPending || update.isPending
 
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description ?? '')
      setPriority(editTask.priority)
      setStatus(editTask.status)
    }
  }, [editTask])
 
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const payload = { title, description, priority, status }
    if (editTask) {
      update.mutate({ id: editTask.id, ...payload }, { onSuccess: onClose })
    } else {
      create.mutate(payload, { onSuccess: onClose })
    }
  }
 
  const inputCls = "w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#f2f2f2] placeholder:text-[#444] focus:outline-none focus:border-[#c8f135]/40 transition-all"
  const selectCls = `${inputCls} cursor-pointer`
 
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#0f0f0f] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1c1c1c]">
          <h2 className="text-[#f2f2f2] font-semibold text-base">
            {editTask ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-[#f2f2f2] transition-colors">
            <X size={18} />
          </button>
        </div>
 
        {/* Form */}
        <form onSubmit={submit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-xs font-medium uppercase tracking-wider">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              required
              className={inputCls}
            />
          </div>
 
          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-xs font-medium uppercase tracking-wider">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes opcionais..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
 
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#666] text-xs font-medium uppercase tracking-wider">Prioridade</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectCls}>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
 
            <div className="flex flex-col gap-1.5">
              <label className="text-[#666] text-xs font-medium uppercase tracking-wider">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectCls}>
                <option value="TODO">A fazer</option>
                <option value="DOING">Em andamento</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>
          </div>
 
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-[#2a2a2a] text-[#9a9a9a] text-sm font-medium py-2.5 rounded-lg hover:bg-[#161616] transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 bg-[#c8f135] text-[#080808] text-sm font-semibold py-2.5 rounded-lg hover:bg-[#b5dc25] disabled:opacity-50 transition-all">
              {isPending ? 'Salvando...' : editTask ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}