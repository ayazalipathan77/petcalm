import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark",
    secondary: "bg-secondary text-white shadow-md hover:bg-secondary-dark",
    accent: "bg-accent text-white shadow-md hover:bg-accent-dark",
    ghost: "bg-transparent text-neutral-subtext hover:bg-neutral-surface hover:text-primary",
    danger: "bg-status-error text-white shadow-lg shadow-status-error/20 hover:opacity-90",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">🐾</span>
      ) : null}
      {children}
    </button>
  );
};
