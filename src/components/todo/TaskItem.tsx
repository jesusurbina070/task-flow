import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, Calendar } from 'lucide-react';
import type { Task } from '../../hooks/useTasks';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.01 }}
            className="group flex items-center gap-4 p-4 bg-surface dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md dark:hover:shadow-gray-900 transition-all duration-200"
        >
            {/* Animated Checkbox */}
            <button
                onClick={() => onToggle(task.id)}
                className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200 ${task.completed
                    ? 'bg-success border-success'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                    }`}
                aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            >
                <AnimatePresence>
                    {task.completed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-medium transition-all duration-200 truncate ${task.completed
                        ? 'text-text-muted dark:text-gray-500 line-through'
                        : 'text-text-main dark:text-gray-100'
                        }`}
                >
                    {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted dark:text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                    </div>
                    {task.tag && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${task.tag === 'Urgente' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                task.tag === 'Zerto' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                                    task.tag === 'Personal' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                        task.tag === 'Trabajo' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                            {task.tag}
                        </span>
                    )}
                </div>
            </div>

            {/* Delete Button (Visible on Hover) */}
            <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-text-muted dark:text-gray-500 hover:text-danger dark:hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-lg transition-all duration-200"
                aria-label="Eliminar tarea"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
