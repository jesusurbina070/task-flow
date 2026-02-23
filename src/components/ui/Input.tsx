import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onEnter?: () => void;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    onEnter,
    onKeyDown,
    className = '',
    ...props
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onEnter) {
            onEnter();
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    return (
        <div className="w-full">
            <label className="sr-only">{props.placeholder || 'Entrada de texto'}</label>
            <input
                className={`w-full px-4 py-2 bg-surface dark:bg-gray-800 border-2 border-transparent rounded-lg text-text-main dark:text-gray-100 placeholder:text-text-muted dark:placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all duration-200 ${className}`}
                onKeyDown={handleKeyDown}
                {...props}
            />
        </div>
    );
};

export default Input;
