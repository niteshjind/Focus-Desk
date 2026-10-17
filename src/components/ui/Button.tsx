import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'paper' | 'white';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const colorClasses: Record<string, string> = {
  yellow: 'bg-[#FFD93D] hover:bg-[#FFE169] text-[#111111]',
  pink: 'bg-[#FF6B9D] hover:bg-[#FF85AE] text-[#111111]',
  blue: 'bg-[#4D96FF] hover:bg-[#6FA9FF] text-[#111111]',
  green: 'bg-[#6BCB77] hover:bg-[#85D68F] text-[#111111]',
  orange: 'bg-[#FF8C42] hover:bg-[#FFA366] text-[#111111]',
  purple: 'bg-[#B983FF] hover:bg-[#C99EFF] text-[#111111]',
  paper: 'bg-[#FFF8E7] hover:bg-[#FFFDF5] text-[#111111]',
  white: 'bg-white hover:bg-neutral-50 text-[#111111]',
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs font-bold gap-1.5',
  md: 'px-4 py-2 text-sm font-bold gap-2',
  lg: 'px-6 py-3 text-base font-bold gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  color = 'yellow',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseColor = colorClasses[color] || colorClasses.yellow;
  if (variant === 'danger') {
    baseColor = 'bg-[#FF4D4D] hover:bg-[#FF6666] text-white';
  } else if (variant === 'ghost') {
    baseColor = 'bg-transparent hover:bg-black/5 text-[#111111] border-none shadow-none';
  }

  const isIcon = variant === 'icon';

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-heading tracking-wide transition-all
        ${isIcon ? 'p-2' : sizeClasses[size]}
        ${variant !== 'ghost' ? 'border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] hover:shadow-[5px_5px_0_#111111] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none' : ''}
        ${baseColor}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
