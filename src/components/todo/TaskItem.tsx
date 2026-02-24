import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, Calendar, Plus } from 'lucide-react';
import type { Task } from '../../hooks/useTasks';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAddSubtask: (taskId: string, title: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export default function TaskItem({
    task,
    onToggle,
    onDelete,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask
}: TaskItemProps) {
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [isExpanded, setIsExpanded] = useState(true); // Default to true as per image or choice

    const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    }) + `, ${new Date(task.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`;

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (subtaskTitle.trim()) {
            onAddSubtask(task.id, subtaskTitle);
            setSubtaskTitle('');
        }
    };

    const taskId = `task-${task.id}`;
    const activeSubtasks = (task.subtasks || []).filter(st => !st.completed);
    const completedSubtasks = (task.subtasks || []).filter(st => st.completed);
    const hasCompleted = completedSubtasks.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group/main bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/50 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-md overflow-hidden relative transition-colors duration-200"
        >
            {/* 1. Header Area */}
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    {/* Main Checkbox */}
                    <div className="relative group/check">
                        <input
                            type="checkbox"
                            id={taskId}
                            checked={task.completed}
                            onChange={() => onToggle(task.id)}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor={taskId}
                            className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${task.completed
                                ? 'bg-emerald-500 border-emerald-500 dark:bg-[#34d399] dark:border-[#34d399]'
                                : 'border-gray-200 dark:border-slate-600 hover:border-primary dark:hover:border-indigo-400'}`}
                        >
                            <AnimatePresence>
                                {task.completed && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </label>
                    </div>

                    <div className="flex-1">
                        <h3 className={`text-xl font-medium tracking-tight transition-colors ${task.completed ? 'text-text-muted dark:text-slate-500 line-through' : 'text-text-main dark:text-slate-100'}`}>
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-text-muted/60 dark:text-slate-400">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formattedDate}</span>
                            </div>
                            {task.tag && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500">
                                    {task.tag}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 opacity-0 group-hover/main:opacity-100 text-text-muted dark:text-slate-500 hover:text-danger dark:hover:text-red-400 hover:bg-danger/5 dark:hover:bg-red-400/10 rounded-lg transition-all"
                        aria-label="Eliminar tarea"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-50 dark:border-slate-700/50" />

            {/* 2. Subtasks Tree Area */}
            <div className="relative pt-3 pb-4 pl-4 pr-5 flex flex-col gap-1">
                {/* Vertical Tree Line */}
                <div className="absolute left-[33px] top-0 bottom-8 w-px bg-gray-200 dark:bg-slate-700" />

                {/* Subtasks Actions Toggle */}
                {hasCompleted && (
                    <div className="relative pl-7 py-2">
                        {/* L Connector for Toggle */}
                        <div className="absolute left-[33px] top-0 bottom-1/2 w-4 border-l border-b border-gray-200 dark:border-slate-700 rounded-bl" />

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50 dark:text-slate-500 hover:text-primary dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group/toggle"
                        >
                            <span>{isExpanded ? 'Ocultar' : 'Mostrar'} {completedSubtasks.length} {completedSubtasks.length === 1 ? 'Completada' : 'Completadas'}</span>
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {isExpanded && completedSubtasks.map((st) => (
                        <SubtaskItem
                            key={st.id}
                            subId={st.id}
                            title={st.title}
                            completed={st.completed}
                            onToggle={() => onToggleSubtask(task.id, st.id)}
                            onDelete={() => onDeleteSubtask(task.id, st.id)}
                        />
                    ))}
                    {activeSubtasks.map((st) => (
                        <SubtaskItem
                            key={st.id}
                            subId={st.id}
                            title={st.title}
                            completed={st.completed}
                            onToggle={() => onToggleSubtask(task.id, st.id)}
                            onDelete={() => onDeleteSubtask(task.id, st.id)}
                        />
                    ))}
                </AnimatePresence>

                {/* Add Step Input */}
                <div className="relative pl-7 pt-2">
                    {/* Bottom-out Connector */}
                    <div className="absolute left-[33px] top-0 h-4 w-4 border-l border-b border-gray-200 dark:border-slate-700 rounded-bl" />

                    <form onSubmit={handleAddSubtask} className="flex items-center gap-2 group/add">
                        <Plus className="w-4 h-4 text-primary dark:text-[#818cf8] group-focus-within:scale-110 transition-transform" />
                        <input
                            type="text"
                            placeholder="Añadir paso..."
                            value={subtaskTitle}
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-primary dark:text-[#818cf8] placeholder:text-primary/40 dark:placeholder:text-indigo-400/30 focus:outline-none w-full"
                        />
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

function SubtaskItem({ subId, title, completed, onToggle, onDelete }: { subId: string, title: string, completed: boolean, onToggle: () => void, onDelete: () => void }) {
    const htmlId = `sub-${subId}`;
    return (
        <div className="relative pl-7 py-1.5 group/sub">
            {/* Curved L Connector */}
            <div className="absolute left-[33px] top-0 bottom-1/2 w-4 border-l border-b border-gray-200 dark:border-slate-700 rounded-bl" />

            <div className="flex items-center gap-3">
                <div className="relative">
                    <input type="checkbox" id={htmlId} checked={completed} onChange={onToggle} className="sr-only peer" />
                    <label
                        htmlFor={htmlId}
                        className={`flex items-center justify-center w-4 h-4 rounded border transition-all cursor-pointer ${completed
                            ? 'bg-emerald-500 border-emerald-500 dark:bg-[#34d399] dark:border-[#34d399]'
                            : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-primary dark:hover:border-indigo-400/50'}`}
                    >
                        {completed && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                    </label>
                </div>
                <span className={`flex-1 text-sm tracking-tight transition-colors ${completed ? 'text-text-muted/60 dark:text-slate-500 line-through' : 'text-text-main dark:text-slate-200'}`}>
                    {title}
                </span>
                <button
                    onClick={onDelete}
                    className="p-1 opacity-0 group-hover/sub:opacity-100 text-text-muted/40 dark:text-slate-500 hover:text-danger dark:hover:text-red-400 hover:bg-danger/5 dark:hover:bg-red-400/10 rounded transition-all"
                    aria-label="Eliminar paso"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
