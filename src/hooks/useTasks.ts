import { useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/ids';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export function useTasks() {
  // Persistencia de tareas en LocalStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('task-flow-tasks', []);
  
  // Estado para el filtro actual (no necesariamente persistido, o sí, pero el requerimiento no lo obliga)
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Funciones CRUD
  
  /**
   * Añadir una nueva tarea
   * @param title Texto de la tarea
   */
  const addTask = (title: string) => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  /**
   * Alternar el estado de completado de una tarea
   * @param id ID de la tarea
   */
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Eliminar una tarea
   * @param id ID de la tarea
   */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
   * Actualizar el texto de una tarea
   * @param id ID de la tarea
   * @param newTitle Nuevo texto
   */
  const updateTask = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: newTitle.trim() } : task
      )
    );
  };

  /**
   * Limpiar todas las tareas completadas
   */
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  // Lógica de filtrado dinámico
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Estadísticas rápidas
  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks, // Por si se necesita la lista completa sin filtrar
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
    stats,
  };
}
