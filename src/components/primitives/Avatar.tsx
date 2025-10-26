import React from 'react';
import clsx from 'clsx';
import { getInitials } from '@/utils/task.utils';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const initials = getInitials(name);

  // Simple solid color based on name
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={clsx(
        'text-white flex items-center justify-center font-bold border-2 border-gray-900',
        sizes[size],
        colors[colorIndex],
        className
      )}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};
