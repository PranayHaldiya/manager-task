'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface DashboardTasksProps {
  tasks: Task[];
  filter: 'all' | 'in_progress' | 'completed' | 'overdue';
  onClose: () => void;
}

export function DashboardTasks({ tasks, filter, onClose }: DashboardTasksProps) {
  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filter) {
      case 'in_progress':
        return tasks.filter(task => task.status === 'in_progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'overdue':
        return tasks.filter(task => 
          task.status !== 'completed' && 
          new Date(task.dueDate) < now
        );
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getStatusIcon = (task: Task) => {
    if (task.status === 'completed') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (task.status === 'in_progress') return <Clock className="h-5 w-5 text-yellow-500" />;
    if (new Date(task.dueDate) < new Date()) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Clock className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {filter === 'all' && 'All Tasks'}
            {filter === 'in_progress' && 'In Progress Tasks'}
            {filter === 'completed' && 'Completed Tasks'}
            {filter === 'overdue' && 'Overdue Tasks'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
        <div className="max-h-[calc(80vh-8rem)] overflow-y-auto p-6">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tasks found
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(task)}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                          <span className="capitalize">Priority: {task.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 