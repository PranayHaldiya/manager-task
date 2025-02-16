'use client';

import { useSession } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { data: session } = useSession();
  const { logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState(session?.user?.name);

  useEffect(() => {
    if (session?.user?.name !== userName) {
      setUserName(session?.user?.name);
    }
  }, [session?.user?.name]);

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Welcome back, {userName}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <button
          onClick={handleSettingsClick}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Settings"
        >
          <User className="h-5 w-5" />
        </button>
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
} 