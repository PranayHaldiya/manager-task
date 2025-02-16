import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task';
import { useProjectsStore } from './use-projects-store';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // Getters
  getFilteredTasks: () => Task[];
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
      
      set({ tasks: data.tasks });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: message });
      console.error('Error fetching tasks:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setTasks: (tasks) => set({ tasks }),

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Get the selected project from the projects store
      const selectedProject = useProjectsStore.getState().selectedProject;
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          projectId: selectedProject?.id, // Include projectId if a project is selected
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }
      
      set((state) => ({ tasks: [...state.tasks, data.task] }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      set({ error: message });
      console.error('Error creating task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task');
      }
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...data.task } : task
        ),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      set({ error: message });
      console.error('Error updating task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete task');
      }
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      set({ error: message });
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task status');
      }
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...data.task } : task
        ),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task status';
      set({ error: message });
      console.error('Error updating task status:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Get tasks filtered by the selected project
  getFilteredTasks: () => {
    const { tasks } = get();
    const selectedProject = useProjectsStore.getState().selectedProject;
    
    if (!selectedProject) {
      return tasks.filter(task => !task.projectId); // Return tasks not associated with any project
    }
    
    return tasks.filter(task => task.projectId === selectedProject.id);
  },
})); 