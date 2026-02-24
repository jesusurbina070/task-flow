import React from 'react';

export type Priority = 'low' | 'medium' | 'high';

interface BadgeProps {
    priority: Priority;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ priority, className = '' }) => {
    const styles = {
        low: 'bg-green-100 text-green-700 border-green-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        high: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[priority]} ${className}`}>
            {labels[priority]}
        </span>
    );
};

export default Badge;
