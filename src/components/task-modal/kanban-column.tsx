import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../schema'
import TaskCard from './task-card'

interface Props {
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
}

const COLUMN_CONFIG: Record<TaskStatus, { label: string; dot: string; badge: string }> = {
  TODO:  { label: 'A fazer',       dot: 'bg-[#555]',          badge: 'bg-[#1c1c1c] text-[#666]' },
  DOING: { label: 'Em andamento',  dot: 'bg-blue-400',        badge: 'bg-blue-500/10 text-blue-400' },
  DONE:  { label: 'Concluído',     dot: 'bg-emerald-400',     badge: 'bg-emerald-500/10 text-emerald-400' },
}

export default function KanbanColumn({ status, tasks, onAddTask, onEditTask }: Props) {
  const cfg = COLUMN_CONFIG[status]

  return (
    <div className="flex flex-col min-w-[300px] flex-1 max-w-[380px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-[#f2f2f2] text-sm font-medium">{cfg.label}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="text-[#444] hover:text-[#c8f135] transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 flex flex-col gap-3 min-h-[200px] rounded-xl p-3 transition-colors duration-150
              ${snapshot.isDraggingOver ? 'bg-[#c8f135]/5 border border-dashed border-[#c8f135]/25' : 'bg-[#0f0f0f] border border-[#161616]'}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-[#333] text-xs">Nenhuma tarefa</p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={onEditTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}