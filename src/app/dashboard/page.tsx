'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useAuth } from '@/hooks/use-auth';
import { DashboardTasks } from '@/components/dashboard/dashboard-tasks';
import { useTasksStore } from '@/store/use-tasks-store';
import { useProjectsStore } from '@/store/use-projects-store';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, isLoading, fetchTasks, getFilteredTasks } = useTasksStore();
  const { selectedProject } = useProjectsStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_progress' | 'completed' | 'overdue' | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refetch tasks when selected project changes
  useEffect(() => {
    fetchTasks();
  }, [selectedProject, fetchTasks]);

  const getTaskStats = () => {
    const now = new Date();
    const filteredTasks = getFilteredTasks();
    const total = filteredTasks.length;
    const inProgress = filteredTasks.filter(task => task.status === 'in_progress').length;
    const completed = filteredTasks.filter(task => task.status === 'completed').length;
    const overdue = filteredTasks.filter(
      task => task.status !== 'completed' && new Date(task.dueDate) < now
    ).length;

    return { total, inProgress, completed, overdue };
  };

  const stats = [
    {
      name: 'Total Tasks',
      value: getTaskStats().total.toString(),
      icon: ListTodo,
      color: 'bg-blue-500',
      filter: 'all' as const,
    },
    {
      name: 'In Progress',
      value: getTaskStats().inProgress.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      filter: 'in_progress' as const,
    },
    {
      name: 'Completed',
      value: getTaskStats().completed.toString(),
      icon: CheckCircle2,
      color: 'bg-green-500',
      filter: 'completed' as const,
    },
    {
      name: 'Overdue',
      value: getTaskStats().overdue.toString(),
      icon: AlertCircle,
      color: 'bg-red-500',
      filter: 'overdue' as const,
    },
  ];

  const filteredTasks = getFilteredTasks();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          {selectedProject && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Project: {selectedProject.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <button
              key={stat.name}
              onClick={() => setSelectedFilter(stat.filter)}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow transition-transform hover:scale-105 hover:shadow-lg dark:bg-gray-800"
            >
              <dt>
                <div className={`absolute rounded-md ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </dd>
            </button>
          ))}
        </div>

        {selectedFilter && (
          <DashboardTasks
            tasks={filteredTasks}
            filter={selectedFilter}
            onClose={() => setSelectedFilter(null)}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Recent Tasks
              </h3>
              <div className="mt-6">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {task.priority} Priority • Due {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {filteredTasks.length === 0 && (
                    <li className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No tasks yet
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h3>
              <div className="mt-6">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks
                    .filter(task => task.status !== 'completed')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((task) => (
                      <li key={task.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  {filteredTasks.length === 0 && (
                    <li className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No upcoming deadlines
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 