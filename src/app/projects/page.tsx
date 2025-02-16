'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { useProjectsStore } from '@/store/use-projects-store';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/error-boundary';

interface ProjectFormData {
  name: string;
  description: string;
}

export default function ProjectsPage() {
  const {
    projects,
    selectedProject,
    isLoading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
  } = useProjectsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<null | { id: string }>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (editingProject) {
      const project = projects.find((p) => p.id === editingProject.id);
      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
        });
      }
    }
  }, [editingProject, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await addProject(formData);
      }
      setIsFormOpen(false);
      setEditingProject(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save project');
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsFormOpen(true);
    setFormData({
      name: project.name,
      description: project.description,
    });
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    setFormData({ name: '', description: '' });
    setFormError(null);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/50">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Projects
            </h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : isFormOpen ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              {formError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/50">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {formError}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`relative rounded-lg border ${
                    selectedProject?.id === project.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white p-6 shadow-sm dark:bg-gray-800`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => selectProject(project)}
                        className={`text-gray-400 hover:text-indigo-500 dark:text-gray-300 ${
                          selectedProject?.id === project.id
                            ? 'text-indigo-500'
                            : ''
                        }`}
                      >
                        <FolderOpen className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-gray-400 hover:text-indigo-500 dark:text-gray-300"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
} 