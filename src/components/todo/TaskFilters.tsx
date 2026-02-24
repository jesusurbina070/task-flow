import { motion } from 'framer-motion';
import type { FilterStatus } from '../../hooks/useTasks';

interface TaskFiltersProps {
    currentFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    stats: {
        total: number;
        active: number;
        completed: number;
    };
}

export default function TaskFilters({ currentFilter, onFilterChange, stats }: TaskFiltersProps) {
    const filters: { label: string; value: FilterStatus; count: number }[] = [
        { label: 'Todas', value: 'all', count: stats.total },
        { label: 'Pendientes', value: 'active', count: stats.active },
        { label: 'Completadas', value: 'completed', count: stats.completed },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl relative overflow-hidden">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                return (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 z-10 ${isActive
                            ? 'text-primary'
                            : 'text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-black/5 dark:ring-white/10 rounded-lg"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{filter.label}</span>
                        <span
                            className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full transition-colors duration-300 ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-200 dark:bg-gray-700 text-text-muted dark:text-gray-400'
                                }`}
                        >
                            {filter.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
