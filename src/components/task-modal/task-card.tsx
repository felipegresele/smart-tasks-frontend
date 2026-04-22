import { useState } from "react"
import { useDeleteTask } from "../../api/useTasks"
import type { Task } from "../../schema"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Draggable } from "@hello-pangea/dnd"

interface Props {
  task: Task
  index: number
  onEdit: (task: Task) => void
}

const PRIORITY_STYLES: Record<string, string> = {
  HIGH:   'bg-red-500/10 text-red-400 border-red-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LOW:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const PRIORITY_LABELS: Record<string, string> = {
  HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa',
}

export default function TaskCard({ task, index, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const deleteTask = useDeleteTask()

  const handleDelete = () => {
    if (confirm('Deletar esta tarefa?')) deleteTask.mutate(task.id)
    setShowMenu(false)
  }

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-[#161616] border rounded-xl p-4 group relative transition-all duration-150
            ${snapshot.isDragging
              ? 'border-[#c8f135]/40 shadow-lg shadow-black/40 rotate-1 scale-[1.02]'
              : 'border-[#222] hover:border-[#2a2a2a]'
            }
          `}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <p className="text-[#f2f2f2] text-sm font-medium leading-snug flex-1">{task.title}</p>
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-[#f2f2f2] transition-all p-0.5 rounded"
              >
                <MoreHorizontal size={15} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl py-1.5 w-36 z-10 shadow-xl">
                  <button
                    onClick={() => { onEdit(task); setShowMenu(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#9a9a9a] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
                  >
                    <Pencil size={13} /> Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400/80 hover:text-red-400 hover:bg-[#222] transition-colors"
                  >
                    <Trash2 size={13} /> Deletar
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-[#555] text-xs leading-relaxed mb-3 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  )
}