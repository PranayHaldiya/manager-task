'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout/main-layout';
import { CalendarView } from '@/components/calendar/calendar-view';
import { TaskForm } from '@/components/tasks/task-form';
import { Task, CreateTaskInput } from '@/types/task';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/error-boundary';
import { useTasksStore } from '@/store/use-tasks-store';
import { useUIStore } from '@/store/use-ui-store';
import { useProjectsStore } from '@/store/use-projects-store';
import { Plus, X } from 'lucide-react';

export default function CalendarPage() {
  const {
    tasks,
    isLoading: isTasksLoading,
    error,
    fetchTasks,
    addTask,
    getFilteredTasks,
  } = useTasksStore();

  const { selectedProject } = useProjectsStore();
  const { selectedDate, setSelectedDate } = useUIStore();
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refetch tasks when selected project changes
  useEffect(() => {
    fetchTasks();
  }, [selectedProject, fetchTasks]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCreatingTask(false);
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    try {
      await addTask(data);
      setIsCreatingTask(false);
      setSelectedDate(null);
      // Refresh tasks after creating a new one
      await fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return getFilteredTasks().filter(task => {
      const taskDate = format(new Date(task.dueDate), 'yyyy-MM-dd');
      return taskDate === selectedDateStr;
    });
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

  const createTaskData: CreateTaskInput = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  };

  const filteredTasks = getFilteredTasks();

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Calendar
              </h1>
              {selectedProject && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Project: {selectedProject.name}
                </p>
              )}
            </div>
          </div>

          {isTasksLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[600px] w-full" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <CalendarView tasks={filteredTasks} onSelectDate={handleDateSelect} />

              {selectedDate && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h2>
                    {!isCreatingTask && (
                      <button
                        onClick={() => setIsCreatingTask(true)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                      </button>
                    )}
                  </div>

                  {isCreatingTask ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">
                          Create New Task
                        </h3>
                        <button
                          onClick={() => setIsCreatingTask(false)}
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <TaskForm
                        onSubmit={handleCreateTask}
                        onCancel={() => setIsCreatingTask(false)}
                        initialData={createTaskData}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        Tasks for this day
                      </h3>
                      {getTasksForSelectedDate().length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No tasks scheduled for this day
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {getTasksForSelectedDate().map((task) => (
                            <div
                              key={task.id}
                              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {task.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {task.description}
                              </p>
                              <div className="mt-2 flex items-center gap-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Status: {task.status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Priority: {task.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
} 