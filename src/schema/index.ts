export type TaskStatus = 'TODO' | 'DOING' | 'DONE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  createdAt: string
  userId: number
}

export interface TaskStats {
  todo: number
  doing: number
  done: number
  total: number
}

export interface AiSuggestedTask {
  title: string
  description: string
  priority: Priority
}

export interface AuthResponse {
  token: string
  name: string
  email: string
  userId: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
}