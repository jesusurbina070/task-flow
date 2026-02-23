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
            className="group flex items-center gap-4 p-4 bg-surface border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
        >
            {/* Animated Checkbox */}
            <button
                onClick={() => onToggle(task.id)}
                className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200 ${task.completed
                    ? 'bg-success border-success'
                    : 'border-gray-300 hover:border-primary'
                    }`}
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
                    className={`text-sm font-medium transition-all duration-200 truncate ${task.completed ? 'text-text-muted line-through' : 'text-text-main'
                        }`}
                >
                    {task.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-muted">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Delete Button (Visible on Hover) */}
            <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all duration-200"
                aria-label="Delete task"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
