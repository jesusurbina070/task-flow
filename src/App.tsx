import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from './components/ui/Button'
import Input from './components/ui/Input'
import Badge from './components/ui/Badge'

function App() {
  const [inputValue, setInputValue] = useState('')

  const handleEnter = () => {
    alert(`Has presionado Enter con: ${inputValue}`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-8 rounded-xl shadow-lg max-w-lg w-full"
      >
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-text-main mb-2 tracking-tight">Componentes Atómicos</h1>
          <p className="text-text-muted">Fase 3: UI Design System</p>
        </header>

        <section className="space-y-6">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Input Estilizado</label>
            <Input
              placeholder="Escribe algo y pulsa Enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onEnter={handleEnter}
            />
          </div>

          {/* Badges */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Prioridades</label>
            <div className="flex gap-3">
              <Badge priority="high" />
              <Badge priority="medium" />
              <Badge priority="low" />
            </div>
          </div>

          {/* Buttons */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Variantes de Botones</label>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Principal</Button>
              <Button variant="danger">Eliminar</Button>
              <Button variant="ghost">Cancelar</Button>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default App