# TaskMaster - Modern Task Management System

A full-featured task management system built with Next.js 14, TypeScript, and Tailwind CSS. TaskMaster helps teams stay organized, collaborate effectively, and deliver projects on time.

![TaskMaster](https://your-screenshot-url.com) <!-- Add a screenshot of your application here -->

## 🌟 Features

### Authentication & User Management
- **Secure Authentication**: Email and password-based authentication using NextAuth.js
- **User Registration**: New user registration with email verification
- **Profile Management**: Update user profile information and email
- **Session Management**: Secure session handling with JWT tokens

### Task Management
- **Task Creation**: Create tasks with title, description, status, and priority
- **Task Organization**: 
  - Set task priorities (Low, Medium, High)
  - Set task status (Todo, In Progress, Completed)
  - Add due dates
  - Assign tasks to projects
- **Task Filtering**: Filter tasks by status, priority, and project
- **Task Search**: Search tasks by title and description
- **Task Comments**: Add and manage comments on tasks
- **Task Assignments**: Assign tasks to team members

### Project Management
- **Project Creation**: Create and manage multiple projects
- **Project Organization**: Group related tasks into projects
- **Project Overview**: View project progress and task distribution
- **Project Filtering**: Filter tasks by project

### Calendar View
- **Task Timeline**: Visualize tasks in a calendar format
- **Due Date Management**: Track task deadlines
- **Date Navigation**: Easy navigation between months
- **Task Creation**: Create tasks directly from calendar view

### Dashboard
- **Task Overview**: Quick view of all tasks and their status
- **Task Statistics**: 
  - Total tasks count
  - Tasks in progress
  - Completed tasks
  - Overdue tasks
- **Recent Activity**: View recently updated tasks
- **Upcoming Deadlines**: Track approaching task deadlines

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in dark mode support
- **Modern UI**: Clean and intuitive interface using Tailwind CSS
- **Loading States**: Smooth loading states and transitions
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Technology Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Lucide React (Icons)
  - Next-Themes (Dark Mode)
  - Zustand (State Management)
  - React Hook Form
  - Date-fns

- **Backend**:
  - Next.js API Routes
  - NextAuth.js
  - Drizzle ORM
  - PostgreSQL
  - Vercel Postgres

- **Development Tools**:
  - ESLint
  - Prettier
  - TypeScript
  - Drizzle Kit

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-master.git
cd task-master
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
POSTGRES_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Create a new project on Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Next.js" as the framework

3. Configure environment variables in Vercel:
   - Set up a Vercel Postgres database from the Storage tab
   - Add the following environment variables:
     ```
     POSTGRES_URL=your-vercel-postgres-url
     NEXTAUTH_SECRET=your-generated-secret
     NEXTAUTH_URL=https://your-app.vercel.app
     ```

4. Deploy:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Database migrations will be run automatically during the build process

### Database Setup on Vercel

1. Create a Vercel Postgres database:
   - Go to your project's "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Follow the setup instructions

2. The database connection string will be automatically added to your environment variables

3. Run migrations on first deployment:
   ```bash
   npx drizzle-kit push:pg
   ```

### Production Considerations

1. **Environment Variables**:
   - Never commit `.env` files to your repository
   - Use Vercel's environment variables UI to set production values
   - Generate a strong NEXTAUTH_SECRET using `openssl rand -base64 32`

2. **Database**:
   - Use connection pooling in production
   - Vercel Postgres handles this automatically
   - Monitor database usage in Vercel dashboard

3. **Performance**:
   - Enable caching where appropriate
   - Use Vercel Edge Functions for better performance
   - Monitor performance in Vercel Analytics

4. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Monitor application logs in Vercel dashboard
   - Set up alerts for critical errors

## 🗂️ Project Structure

```
task-management-system/
├── src/
│   ├── app/                 # Next.js pages and API routes
│   │   ├── api/            # API endpoints
│   │   ├── auth/           # Authentication pages
│   │   └── ...            # Other pages
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── tasks/         # Task-related components
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── providers/         # Context providers
│   ├── store/             # Zustand store configurations
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── public/                # Static files
└── drizzle/              # Database migrations and schema
```

## 🔒 Authentication Flow

1. **Registration**:
   - User fills out registration form
   - Email and password validation
   - Account creation in database
   - Automatic login after registration

2. **Login**:
   - Email and password authentication
   - JWT token generation
   - Secure session management

3. **Profile Update**:
   - Update user information
   - Email change verification
   - Password update with confirmation

## 🛠️ Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Start production server: `npm start`
- Format code: `npm run format`
- Lint code: `npm run lint`
- Generate database types: `npm run db:generate`
- Push database changes: `npm run db:push`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGithubUsername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and infrastructure
- Tailwind CSS team for the styling framework
- All contributors who have helped this project grow

## 📧 Contact

- Your Name - [your.email@example.com](mailto:your.email@example.com)
- Project Link: [https://github.com/yourusername/task-master](https://github.com/yourusername/task-master)

---
Made with ❤️ by [Your Name](https://github.com/yourusername)
