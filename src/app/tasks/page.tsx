'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { useTasksStore } from '@/store/use-tasks-store';
import { useUIStore } from '@/store/use-ui-store';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/error-boundary';

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useTasksStore();

  const { isTaskFormOpen, editingTask, openTaskForm, closeTaskForm, setEditingTask } =
    useUIStore();

  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (data: Omit<Task, 'id'>) => {
    setActionError(null);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        closeTaskForm();
      } else {
        await addTask(data);
        closeTaskForm();
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to save task');
    }
  };

  const handleEdit = (task: Task) => {
    setActionError(null);
    setEditingTask(task);
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setActionError(null);
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setActionError(null);
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to update task status');
    }
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
              Tasks
            </h1>
            <button
              onClick={openTaskForm}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </button>
          </div>

          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/50">
              <p className="text-sm text-red-600 dark:text-red-400">{actionError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : isTaskFormOpen ? (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <TaskForm
                initialData={editingTask || undefined}
                onSubmit={handleSubmit}
                onCancel={closeTaskForm}
              />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
} 