import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, Calendar } from 'lucide-react';
import TagBadge from '../ui/TagBadge';
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

    const taskId = `task-${task.id}`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.01 }}
            className="group relative flex items-center gap-4 p-4 bg-surface dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md dark:hover:shadow-gray-900 transition-all duration-200"
        >
            {/* 1. Real checkbox input (hidden but accessible) */}
            <input
                type="checkbox"
                id={taskId}
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="sr-only peer"
            />

            {/* 2. Main content wrapped in a label for better A11y and hit area */}
            <label
                htmlFor={taskId}
                className="flex flex-1 items-center gap-4 cursor-pointer min-w-0"
            >
                {/* Visual Checkbox */}
                <div
                    className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200 ${task.completed
                        ? 'bg-success border-success'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2'
                        }`}
                    aria-hidden="true"
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
                </div>

                {/* Task Text and Metadata */}
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm font-medium transition-all duration-200 truncate ${task.completed
                            ? 'text-text-muted dark:text-gray-500 line-through'
                            : 'text-text-main dark:text-gray-100'
                            }`}
                    >
                        <span className="sr-only">
                            {task.completed ? 'Tarea completada: ' : 'Tarea pendiente: '}
                        </span>
                        {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-text-muted dark:text-gray-500">
                        <div className="flex items-center gap-1.5 text-[10px]">
                            <Calendar className="w-3 h-3" />
                            <span>{formattedDate}</span>
                        </div>
                        {task.tag && <TagBadge tag={task.tag} />}
                    </div>
                </div>
            </label>

            {/* 3. Delete Action */}
            <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-2 text-text-muted dark:text-gray-500 hover:text-danger dark:hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-danger"
                aria-label={`Eliminar tarea: ${task.title}`}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
