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
                        className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
                    >
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <ClipboardList className="w-8 h-8 text-text-muted opacity-50" />
                        </div>
                        <p className="text-text-main font-semibold">No hay tareas pendientes</p>
                        <p className="text-sm text-text-muted mt-1 max-w-[200px] text-center">
                            ¡Tu lista está limpia! Añade una tarea nueva arriba para empezar.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
