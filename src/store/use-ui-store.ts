import { create } from 'zustand';
import { Task } from '@/types/task';

interface UIState {
  isTaskFormOpen: boolean;
  isProjectFormOpen: boolean;
  editingTask: Task | null;
  isSidebarOpen: boolean;
  selectedDate: Date | null;
  // Actions
  openTaskForm: () => void;
  closeTaskForm: () => void;
  openProjectForm: () => void;
  closeProjectForm: () => void;
  setEditingTask: (task: Task | null) => void;
  toggleSidebar: () => void;
  setSelectedDate: (date: Date | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTaskFormOpen: false,
  isProjectFormOpen: false,
  editingTask: null,
  isSidebarOpen: true,
  selectedDate: null,

  openTaskForm: () => set({ isTaskFormOpen: true }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTask: null }),
  openProjectForm: () => set({ isProjectFormOpen: true }),
  closeProjectForm: () => set({ isProjectFormOpen: false }),
  setEditingTask: (task) => set({ editingTask: task, isTaskFormOpen: true }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSelectedDate: (date) => set({ selectedDate: date }),
})); 