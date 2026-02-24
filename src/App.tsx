import { motion } from 'framer-motion'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/todo/TaskForm'
import TaskList from './components/todo/TaskList'
import ProgressBar from './components/todo/ProgressBar'
import TaskFilters from './components/todo/TaskFilters'
import ThemeToggle from './components/ui/ThemeToggle'
import SearchBar from './components/ui/SearchBar'

function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery
  } = useTasks()

  const secret = '1234567890'
  console.log(secret)

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col items-center py-12 px-4 sm:px-6 font-sans transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full flex flex-col gap-8"
      >
        {/* Header Section */}
        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold tracking-tight">TaskFlow</h1>
            <p className="text-text-muted transition-colors">Organiza tu día con facilidad y estilo.</p>
          </div>
          <ThemeToggle />
        </header>

        {/* Search Section */}
        <section>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* Stats Section (Progress Bar) */}
        <section className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <ProgressBar completed={stats.completed} total={stats.total} />
        </section>

        {/* Input Section */}
        <section>
          <TaskForm onAdd={addTask} />
        </section>

        {/* Task List Section */}
        <section className="flex-1">
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </section>

        {/* Filters Section (Sticky at bottom or just at the end) */}
        <section className="sticky bottom-8 mt-4">
          <div className="bg-surface/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              stats={stats}
            />
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default App;