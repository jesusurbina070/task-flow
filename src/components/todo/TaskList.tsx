import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import type { Task } from '../../hooks/useTasks';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
    return (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50"
                    >
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                            <ClipboardList className="w-8 h-8 text-text-muted dark:text-gray-500 opacity-50" />
                        </div>
                        <p className="text-text-main dark:text-gray-100 font-semibold">No hay tareas pendientes</p>
                        <p className="text-sm text-text-muted dark:text-gray-500 mt-1 max-w-[200px] text-center">
                            ¡Tu lista está limpia! Es el momento perfecto para empezar algo increíble.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
