import { create } from 'zustand';

interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchProjects: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }
      
      set({ projects: data.projects });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch projects';
      set({ error: message });
      console.error('Error fetching projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setProjects: (projects) => set({ projects }),

  addProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }
      
      set((state) => ({
        projects: [...state.projects, data.project],
        selectedProject: data.project,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project';
      set({ error: message });
      console.error('Error creating project:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project');
      }
      
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...data.project } : project
        ),
        selectedProject: state.selectedProject?.id === id 
          ? { ...state.selectedProject, ...data.project }
          : state.selectedProject,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update project';
      set({ error: message });
      console.error('Error updating project:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }
      
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      set({ error: message });
      console.error('Error deleting project:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  selectProject: (project) => set({ selectedProject: project }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 