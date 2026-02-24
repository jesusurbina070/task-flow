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
        <div className="flex items-center bg-gray-100/30 dark:bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-transparent dark:border-slate-700/50 mx-auto w-max max-w-sm">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                return (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${isActive
                            ? 'bg-white dark:bg-slate-700 text-primary dark:text-indigo-400 shadow-sm dark:shadow-none'
                            : 'text-text-muted dark:text-slate-500 hover:text-text-main dark:hover:text-slate-300 bg-transparent'
                            }`}
                    >
                        <span>{filter.label}</span>
                        <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums transition-colors ${isActive
                                ? 'bg-primary/10 dark:bg-indigo-400/10 text-primary dark:text-indigo-400'
                                : 'bg-gray-200/50 dark:bg-slate-800/50 text-text-muted dark:text-slate-500'
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
