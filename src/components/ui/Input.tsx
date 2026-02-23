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
        <input
            className={`w-full px-4 py-2 bg-surface border-2 border-transparent rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all duration-200 ${className}`}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
};

export default Input;
