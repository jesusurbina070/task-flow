import { useState } from 'react';
import { Plus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TaskFormProps {
    onAdd: (title: string, tag: string) => void;
}

const CATEGORIES = [
    { id: 'general', name: 'General', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' },
    { id: 'personal', name: 'Personal', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { id: 'trabajo', name: 'Trabajo', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { id: 'urgente', name: 'Urgente', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
];

export default function TaskForm({ onAdd }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [selectedTag, setSelectedTag] = useState('General');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (title.trim()) {
            onAdd(title, selectedTag);
            setTitle('');
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3"
            >
                <div className="flex-1">
                    <Input
                        placeholder="¿Qué necesitas hacer hoy?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onEnter={handleSubmit}
                        className="px-0 py-0 border-none focus:border-none ring-0 focus:ring-0 text-lg font-medium bg-transparent dark:bg-transparent"
                        autoFocus
                    />
                </div>
                <Button
                    type="submit"
                    variant="primary"
                    className="h-10 w-10 !p-0 flex items-center justify-center rounded-lg shadow-md shadow-primary/20"
                    disabled={!title.trim()}
                    aria-label="Añadir nueva tarea"
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </form>

            {/* Tag Selector */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedTag(cat.name)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${selectedTag === cat.name
                            ? `${cat.color} ring-2 ring-primary/20 scale-105 shadow-sm`
                            : 'bg-gray-50 dark:bg-gray-800/50 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700 opacity-60 hover:opacity-100'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
