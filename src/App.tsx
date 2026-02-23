import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/todo/TaskForm'
import TaskItem from './components/todo/TaskItem'

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
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl"
                >
                  <p className="text-text-muted font-medium">No hay tareas pendientes</p>
                  <p className="text-xs text-text-muted mt-1">¡Añade una para empezar!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default App;