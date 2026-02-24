import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar tareas o categorías...' }: SearchBarProps) {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors duration-200">
                <Search className="w-4 h-4" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 bg-surface dark:bg-gray-800 border-2 border-transparent rounded-xl text-sm text-text-main dark:text-gray-100 placeholder:text-text-muted dark:placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-sm"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all duration-200"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
