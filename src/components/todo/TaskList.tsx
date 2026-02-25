import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import type { Task, FilterStatus } from '../../hooks/useTasks';
import { ClipboardList } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAddSubtask: (taskId: string, text: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
    onReorder: (newTasks: Task[]) => void;
    currentFilter: FilterStatus;
    searchQuery: string;
}

export default function TaskList({
    tasks,
    onToggle,
    onDelete,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask,
    onReorder,
    currentFilter,
    searchQuery
}: TaskListProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<Task[]>(tasks);

    // Sincronizar items locales con las tasks globales cuando no estamos arrastrando
    // Esto es crucial para que cambios externos (completar, borrar) se reflejen
    useEffect(() => {
        if (!activeId) {
            setItems(tasks);
        }
    }, [tasks, activeId]);

    const isDragDisabled = currentFilter !== 'all' || searchQuery.trim() !== '';

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Pequeña tolerancia para no disparar el drag por error
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((t) => t.id === active.id);
            const newIndex = items.findIndex((t) => t.id === over.id);

            // Reordenación inmediata en el estado local para fluidez visual
            setItems((prev) => arrayMove(prev, oldIndex, newIndex));
        }
    }

    function handleDragEnd() {
        // Sincronización final y persistencia
        // Actualizamos las posiciones basadas en el nuevo orden
        const finalTasks = items.map((task, index) => ({
            ...task,
            position: index,
        }));

        onReorder(finalTasks);
        setActiveId(null);
    }

    const activeTask = activeId ? items.find(t => t.id === activeId) : null;

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={isDragDisabled ? [] : sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-3">
                <SortableContext
                    items={items.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <AnimatePresence mode="popLayout">
                        {items.length > 0 ? (
                            items.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onAddSubtask={onAddSubtask}
                                    onToggleSubtask={onToggleSubtask}
                                    onDeleteSubtask={onDeleteSubtask}
                                    dragDisabled={isDragDisabled}
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
                </SortableContext>
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? (
                    <div className="w-full pointer-events-none opacity-80 scale-105 shadow-2xl">
                        <TaskItem
                            task={activeTask}
                            onToggle={() => { }}
                            onDelete={() => { }}
                            onAddSubtask={() => { }}
                            onToggleSubtask={() => { }}
                            onDeleteSubtask={() => { }}
                            dragDisabled={false}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
