import { useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/ids';
import { useDebounce } from './useDebounce';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  tag: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export function useTasks() {
  // Persistencia de tareas en LocalStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('task-flow-tasks', []);
  
  // Estado para el filtro actual
  const [filter, setFilter] = useState<FilterStatus>('all');
  
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Funciones CRUD
  
  /**
   * Añadir una nueva tarea
   * @param title Texto de la tarea
   * @param tag Categoría de la tarea
   */
  const addTask = (title: string, tag: string = 'General') => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
      tag: tag.trim(),
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

  // Lógica de filtrado y búsqueda dinámicos
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Primero aplicamos el filtro de estado
    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Luego aplicamos el filtro de búsqueda
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((t) => 
        t.title.toLowerCase().includes(query) || 
        t.tag.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filter, debouncedSearchQuery]);

  // Estadísticas rápidas
  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
    stats,
  };
}
