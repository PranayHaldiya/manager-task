'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { UserPlus, X, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: string;
  taskId: string;
  userId: string;
  assignedById: string;
  createdAt: string;
  user: User;
}

interface TaskAssignmentsProps {
  taskId: string;
}

export function TaskAssignments({ taskId }: TaskAssignmentsProps) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.assignments);
    } catch (error) {
      setError('Failed to load assignments');
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setAvailableUsers(data.users);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchAvailableUsers();
  }, [taskId]);

  const handleAssign = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to assign user');

      const data = await response.json();
      setAssignments((prev) => [...prev, data.assignment]);
      setIsAssigning(false);
    } catch (error) {
      setError('Failed to assign user');
      console.error('Error assigning user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;

    try {
      const response = await fetch(
        `/api/tasks/${taskId}/assignments/${assignmentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to remove assignment');

      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== assignmentId)
      );
    } catch (error) {
      setError('Failed to remove assignment');
      console.error('Error removing assignment:', error);
    }
  };

  const unassignedUsers = availableUsers.filter(
    (availableUser) =>
      !assignments.some((assignment) => assignment.userId === availableUser.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Assigned Users
        </h3>
        <button
          onClick={() => setIsAssigning(!isAssigning)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Assign User
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Users className="h-8 w-8 p-2 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {assignment.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {assignment.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUnassign(assignment.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {isAssigning && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Available Users
          </h4>
          <div className="space-y-2">
            {unassignedUsers.map((availableUser) => (
              <button
                key={availableUser.id}
                onClick={() => handleAssign(availableUser.id)}
                disabled={isLoading}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {availableUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {availableUser.email}
                  </p>
                </div>
                <UserPlus className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 