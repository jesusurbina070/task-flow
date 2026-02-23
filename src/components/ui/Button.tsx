import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:opacity-90 focus:ring-primary/50',
        ghost: 'bg-transparent text-text-muted hover:bg-background hover:text-text-main focus:ring-gray-200',
        danger: 'bg-danger text-white hover:opacity-90 focus:ring-danger/50',
    };

    const variantStyles = variants[variant];

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
