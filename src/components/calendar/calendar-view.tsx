'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}

export function CalendarView({ tasks, onSelectDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate((date) => subMonths(date, 1))}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate((date) => addMonths(date, 1))}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((date) => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                'aspect-square rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700',
                !isCurrentMonth && 'text-gray-400 dark:text-gray-600'
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm">{format(date, 'd')}</span>
                {dayTasks.length > 0 && (
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 