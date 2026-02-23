import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface p-8 rounded-lg shadow-sm max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-success w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2 font-sans">TaskFlow Phase 1</h1>
        <p className="text-text-muted mb-6">
          Estructura y estilos configurados correctamente.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Comenzar
        </button>
      </motion.div>
    </div>
  )
}

export default App
