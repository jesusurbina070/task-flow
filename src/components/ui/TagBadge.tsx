import React from 'react';

interface TagBadgeProps {
    tag: string;
    className?: string;
}

const TAG_STYLES: Record<string, string> = {
    Urgente: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50',
    Zerto: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
    Personal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
    Trabajo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    General: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600/50',
};

const TagBadge: React.FC<TagBadgeProps> = ({ tag, className = '' }) => {
    const style = TAG_STYLES[tag] || TAG_STYLES.General;

    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${style} ${className}`}>
            {tag}
        </span>
    );
};

export default TagBadge;
