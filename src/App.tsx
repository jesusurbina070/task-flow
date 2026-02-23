import { motion } from 'framer-motion'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/todo/TaskForm'
import TaskList from './components/todo/TaskList'
import ProgressBar from './components/todo/ProgressBar'
import TaskFilters from './components/todo/TaskFilters'

function App() {
  const { tasks, addTask, toggleTask, deleteTask, stats, filter, setFilter } = useTasks()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full flex flex-col gap-8"
      >
        {/* Header Section */}
        <header className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-text-main tracking-tight">TaskFlow</h1>
          <p className="text-text-muted">Organiza tu día con facilidad y estilo.</p>
        </header>

        {/* Stats Section (Progress Bar) */}
        <section className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
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
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-100">
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