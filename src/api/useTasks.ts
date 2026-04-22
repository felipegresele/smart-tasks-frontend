import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "./tasks";
import type { Priority, TaskStatus } from "../schema";

export const TASKS_KEY = ['tasks'] as const
export const STATS_KEY = ['tasks', 'stats'] as const
 
export const useTasks = (filters?: { status?: TaskStatus; priority?: Priority }) =>
  useQuery({ queryKey: [...TASKS_KEY, filters], queryFn: () => tasksApi.getAll(filters) })
 
export const useTaskStats = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: tasksApi.getStats })
 
export const useCreateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: STATS_KEY })
    },
  })
}
 
export const useUpdateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tasksApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: STATS_KEY })
    },
  })
}
 
export const useUpdateTaskStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tasksApi.updateStatus,
    // optimistic update
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY })
      const snapshots = qc.getQueriesData({ queryKey: TASKS_KEY })
      qc.setQueriesData({ queryKey: TASKS_KEY }, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.map((t) => (t.id === id ? { ...t, status } : t))
      })
      return { snapshots }
    },
    onError: (_e, _v, ctx) => {
      ctx?.snapshots?.forEach(([key, val]) => qc.setQueryData(key, val))
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: STATS_KEY })
    },
  })
}
 
export const useDeleteTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: STATS_KEY })
    },
  })
}
 
export const useSuggestTasks = () =>
  useMutation({ mutationFn: tasksApi.suggest })