import { api } from "..";
import type { AiSuggestedTask, CreateTaskRequest, Priority, Task, TaskStats, TaskStatus } from "../../schema";

export const tasksApi = {
  getAll: async (filters?: { status?: TaskStatus; priority?: Priority }): Promise<Task[]> => {
    const res = await api.get('/tasks', { params: filters })
    return res.data
  },
 
  create: async (data: CreateTaskRequest): Promise<Task> => {
    const res = await api.post('/tasks', data)
    return res.data
  },
 
  update: async ({ id, ...data }: CreateTaskRequest & { id: number }): Promise<Task> => {
    const res = await api.put(`/tasks/${id}`, data)
    return res.data
  },
 
  updateStatus: async ({ id, status }: { id: number; status: TaskStatus }): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}/status`, null, { params: { status } })
    return res.data
  },
 
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
 
  getStats: async (): Promise<TaskStats> => {
    const res = await api.get('/tasks/stats')
    return res.data
  },
 
  suggest: async (text: string): Promise<AiSuggestedTask[]> => {
    const res = await api.post('/tasks/suggest', { text })
    return res.data
  },
}
 