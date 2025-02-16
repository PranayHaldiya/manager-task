'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  Users,
  Layout,
  Clock,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

const features = [
  {
    name: 'Task Management',
    description:
      'Create, organize, and track tasks with ease. Set priorities, deadlines, and status updates.',
    icon: CheckCircle2,
  },
  {
    name: 'Team Collaboration',
    description:
      'Work together seamlessly with your team. Share projects, assign tasks, and track progress.',
    icon: Users,
  },
  {
    name: 'Calendar View',
    description:
      'Visualize your tasks and deadlines in a calendar format. Never miss important dates.',
    icon: Calendar,
  },
  {
    name: 'Project Organization',
    description:
      'Group related tasks into projects. Keep everything organized and easily accessible.',
    icon: Layout,
  },
  {
    name: 'Time Tracking',
    description:
      'Monitor time spent on tasks and projects. Improve productivity and resource allocation.',
    icon: Clock,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => window.location.reload()}
              className="text-xl font-bold text-gray-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              TaskMaster
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mt-16 flex min-h-[calc(100vh-4rem)] items-center bg-gradient-to-b from-white to-gray-50 px-4 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Manage Tasks with
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Confidence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            A modern task management system that helps teams stay organized,
            collaborate effectively, and deliver projects on time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start for Free
            </Link>
            <Link
              href="#features"
              className="flex items-center text-base font-semibold text-gray-900 dark:text-white"
            >
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage tasks effectively
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our comprehensive task management solution provides all the tools you
              need to stay organized and productive.
            </p>
          </div>
          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute -left-8 -top-8">
                  <feature.icon className="h-16 w-16 text-indigo-600/20" />
                </div>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-24 dark:bg-indigo-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
            Join thousands of teams who use TaskMaster to manage their projects and
            tasks efficiently.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-md bg-white px-5 py-3 text-base font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started for Free
            </Link>
            <Link
              href="/auth/login"
              className="text-base font-semibold text-white"
            >
              Sign In <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TaskMaster
              </span>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Making task management simple and efficient for teams of all sizes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="#features"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Connect
                </h3>
                <div className="mt-4 flex space-x-6">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 