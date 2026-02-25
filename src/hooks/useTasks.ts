import { useMemo, useReducer, useEffect } from 'react';
import { generateId } from '../utils/ids';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  tag: string;
  dueDate?: string;
  priority: Priority;
  subtasks: Subtask[];
  position: number;
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
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_SUBTASK'; payload: { taskId: string; title: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subtaskId: string } }
  | { type: 'DELETE_SUBTASK'; payload: { taskId: string; subtaskId: string } }
  | { type: 'REORDER_TASKS'; payload: Task[] };

// --- Reducer Function ---

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK': {
      const newTask: Task = {
        id: generateId(),
        title: action.payload.title.trim(),
        completed: false,
        createdAt: Date.now(),
        tag: action.payload.tag.trim(),
        dueDate: action.payload.dueDate,
        priority: action.payload.priority,
        subtasks: [],
        position: 0,
      };
      // Incrementamos la posición de todas las tareas existentes para dejar hueco en el índice 0
      const shiftedTasks = state.tasks.map(t => ({ ...t, position: t.position + 1 }));
      return { ...state, tasks: [newTask, ...shiftedTasks] };
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
    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            const newSubtask: Subtask = {
              id: generateId(),
              title: action.payload.title.trim(),
              completed: false,
            };
            return {
              ...task,
              subtasks: [...(task.subtasks || []), newSubtask]
            };
          }
          return task;
        }),
      };
    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            const updatedSubtasks = (task.subtasks || []).map((st) =>
              st.id === action.payload.subtaskId ? { ...st, completed: !st.completed } : st
            );

            // Auto-complete logic: 
            // 1. If all subtasks are completed (and there is at least one), the main task becomes completed.
            // 2. If at least one subtask is now incomplete, the main task becomes incomplete ONLY IF it was marked as completed previously.
            const allSubtasksDone = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);

            return {
              ...task,
              subtasks: updatedSubtasks,
              completed: allSubtasksDone ? true : (allSubtasksDone === false && task.completed ? false : task.completed)
            };
          }
          return task;
        }),
      };
    case 'DELETE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            return {
              ...task,
              subtasks: (task.subtasks || []).filter((st) => st.id !== action.payload.subtaskId),
            };
          }
          return task;
        }),
      };
    default:
      return state;
  }
}

// --- Hook ---

export function useTasks() {
  const [savedTasks, setSavedTasks] = useLocalStorage<Task[]>('task-flow-tasks', []);

  // Inicializamos el estado desde LocalStorage con migración de posición
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: (() => {
      return savedTasks.map((t: any, index: number) => ({
        ...t,
        subtasks: t.subtasks || [],
        position: typeof t.position === 'number' ? t.position : index
      }));
    })(),
    filter: 'all',
    searchQuery: '',
  });

  // Sincronización con LocalStorage vía el setter del hook
  // Debido a que el drag inmediato es local en TaskList, este effect solo
  // se dispara una vez al final del drag (onDragEnd -> onReorder).
  useEffect(() => {
    setSavedTasks(state.tasks);
  }, [state.tasks, setSavedTasks]);

  const { tasks, filter, searchQuery } = state;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Funciones CRUD (Disparan acciones)

  const addTask = (title: string, tag = 'General', dueDate?: string, priority: Priority = 'medium') => {
    if (!title.trim()) return;
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

  /**
   * Añadir una subtarea a una tarea existente
   * @param taskId ID de la tarea padre
   * @param title Texto de la subtarea
   */
  const addSubtask = (taskId: string, title: string) => {
    dispatch({ type: 'ADD_SUBTASK', payload: { taskId, title } });
  };

  /**
   * Alternar el estado de completado de una subtarea
   * @param taskId ID de la tarea padre
   * @param subtaskId ID de la subtarea
   */
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId, subtaskId } });
  };

  /**
   * Eliminar una subtarea
   * @param taskId ID de la tarea padre
   * @param subtaskId ID de la subtarea
   */
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    dispatch({ type: 'DELETE_SUBTASK', payload: { taskId, subtaskId } });
  };

  const reorderTasks = (newTasks: Task[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: newTasks });
  };

  // Lógica de filtrado, búsqueda y ORDENACIÓN dinámica
  const filteredTasks = useMemo(() => {
    let result = [...tasks]; // Copia para no mutar el estado durante el sort

    // Filtro de estado
    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Filtro de búsqueda
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.tag.toLowerCase().includes(query)
      );
    }

    // Ordenación por posición (Drag & Drop ready)
    return result.sort((a, b) => a.position - b.position);
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
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    reorderTasks,
    stats,
  };
}
