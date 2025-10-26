import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold border-2 uppercase focus:outline-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-700',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 border-gray-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 border-red-700',
    ghost: 'text-gray-900 hover:bg-gray-200 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
