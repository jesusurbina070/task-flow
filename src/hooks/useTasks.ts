import { useMemo, useState, useReducer, useEffect } from 'react';
import { generateId } from '../utils/ids';
import { useDebounce } from './useDebounce';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  tag: string;
  dueDate?: string;
  priority: Priority;
}

export type FilterStatus = 'all' | 'active' | 'completed';

// --- Reducer Types ---

interface TaskState {
  tasks: Task[];
  filter: FilterStatus;
  searchQuery: string;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: { title: string; tag: string; dueDate?: string; priority: Priority } }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; title: string } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

// --- Reducer Function ---

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        id: generateId(),
        title: action.payload.title.trim(),
        completed: false,
        createdAt: Date.now(),
        tag: action.payload.tag.trim(),
        dueDate: action.payload.dueDate,
        priority: action.payload.priority,
      };
      return { ...state, tasks: [newTask, ...state.tasks] };
    }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, title: action.payload.title.trim() }
            : task
        ),
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

// --- Hook ---

export function useTasks() {
  // Inicializamos el estado desde LocalStorage
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: JSON.parse(localStorage.getItem('task-flow-tasks') || '[]'),
    filter: 'all',
    searchQuery: '',
  });

  // Sincronización con LocalStorage
  useEffect(() => {
    localStorage.setItem('task-flow-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  const { tasks, filter, searchQuery } = state;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Funciones CRUD (Disparan acciones)

  const addTask = (title: string, tag = 'General', dueDate?: string, priority: Priority = 'medium') => {
    dispatch({ type: 'ADD_TASK', payload: { title, tag, dueDate, priority } });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const updateTask = (id: string, newTitle: string) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, title: newTitle } });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const setFilter = (filter: FilterStatus) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
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
