import { useState } from 'react';
import { Plus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TaskFormProps {
    onAdd: (title: string) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (title.trim()) {
            onAdd(title);
            setTitle('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 p-4 bg-surface rounded-xl shadow-sm border border-gray-100"
        >
            <div className="flex-1">
                <Input
                    placeholder="¿Qué necesitas hacer hoy?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onEnter={handleSubmit}
                    className="px-0 py-0 border-none focus:border-none ring-0 focus:ring-0 text-lg font-medium"
                />
            </div>
            <Button
                type="submit"
                variant="primary"
                className="h-10 w-10 !p-0 flex items-center justify-center rounded-lg shadow-md shadow-primary/20"
                disabled={!title.trim()}
            >
                <Plus className="w-6 h-6" />
            </Button>
        </form>
    );
}
