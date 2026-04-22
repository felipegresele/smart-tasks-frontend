import { useState } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Plus, Filter } from 'lucide-react'
import type { Priority, Task, TaskStatus } from '../schema'
import { useTasks, useUpdateTaskStatus } from '../api/useTasks'
import Sidebar from './sidebar'
import KanbanColumn from './task-modal/kanban-column'
import AiInput from './task-modal/ai-input'
import TaskModal from './task-modal/task-modal'

const COLUMNS: TaskStatus[] = ['TODO', 'DOING', 'DONE']

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')

  const { data: tasks = [], isLoading } = useTasks(
    filterPriority ? { priority: filterPriority } : undefined
  )
  const updateStatus = useUpdateTaskStatus()

  const openCreate = (status: TaskStatus = 'TODO') => {
    setEditTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    updateStatus.mutate({
      id: parseInt(draggableId),
      status: destination.droppableId as TaskStatus,
    })
  }

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status)

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-[#161616] bg-[#080808]">
          <div>
            <h1 className="text-[#f2f2f2] text-lg font-semibold">Board</h1>
            <p className="text-[#444] text-xs mt-0.5">
              {isLoading ? '...' : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter by priority */}
            <div className="flex items-center gap-2 bg-[#111] border border-[#1c1c1c] rounded-lg px-3 py-2">
              <Filter size={13} className="text-[#444]" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
                className="bg-transparent text-[#9a9a9a] text-sm focus:outline-none cursor-pointer"
              >
                <option value="">Todas</option>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Média</option>
                <option value="LOW">Baixa</option>
              </select>
            </div>

            <button
              onClick={() => openCreate()}
              className="flex items-center gap-2 bg-[#c8f135] text-[#080808] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b5dc25] active:scale-[0.97] transition-all"
            >
              <Plus size={15} />
              Nova tarefa
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex gap-6 h-full">
            {/* Kanban */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex gap-6">
                  {COLUMNS.map((col) => (
                    <div key={col} className="flex-1 min-w-[280px]">
                      <div className="h-5 w-24 bg-[#1c1c1c] rounded mb-4 animate-pulse" />
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#161616] border border-[#222] rounded-xl p-4 mb-3 h-20 animate-pulse" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-6 h-full">
                    {COLUMNS.map((status) => (
                      <KanbanColumn
                        key={status}
                        status={status}
                        tasks={tasksByStatus(status)}
                        onAddTask={openCreate}
                        onEditTask={openEdit}
                      />
                    ))}
                  </div>
                </DragDropContext>
              )}
            </div>

            {/* AI sidebar panel */}
            <div className="w-80 shrink-0">
              <AiInput />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          onClose={() => setModalOpen(false)}
          editTask={editTask}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  )
}