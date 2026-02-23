import { motion } from 'framer-motion'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/todo/TaskForm'
import TaskList from './components/todo/TaskList'

function App() {
  const { tasks, addTask, toggleTask, deleteTask, stats } = useTasks()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-text-main tracking-tight">TaskFlow</h1>
            <p className="text-text-muted mt-1">Organiza tu día con facilidad</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">{stats.active}</span>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Pendientes</p>
          </div>
        </header>

        <section className="space-y-8">
          {/* Quick Add Form */}
          <TaskForm onAdd={addTask} />

          {/* Task List */}
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </section>
      </motion.div>
    </div>
  )
}

export default App;