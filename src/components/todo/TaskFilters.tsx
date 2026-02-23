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
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                return (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                            ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                            : 'text-text-muted hover:text-text-main hover:bg-white/50'
                            }`}
                    >
                        {filter.label}
                        <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-text-muted'
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
