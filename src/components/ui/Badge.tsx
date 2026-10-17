import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'danger' | 'dark' | 'paper';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  yellow: 'bg-[#FFD93D] text-[#111111]',
  pink: 'bg-[#FF6B9D] text-[#111111]',
  blue: 'bg-[#4D96FF] text-[#111111]',
  green: 'bg-[#6BCB77] text-[#111111]',
  orange: 'bg-[#FF8C42] text-[#111111]',
  purple: 'bg-[#B983FF] text-[#111111]',
  danger: 'bg-[#FF4D4D] text-white',
  dark: 'bg-[#111111] text-[#FFF8E7]',
  paper: 'bg-[#FFF8E7] text-[#111111]',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'yellow',
  size = 'md',
  className = '',
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 font-heading font-black uppercase tracking-wider
        border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] select-none
        ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}
        ${variantStyles[variant]}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
