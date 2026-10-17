import React from 'react';
import { Flame } from 'lucide-react';

export interface FlameIconProps {
  isActive: boolean;
  isAtRisk: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FlameIcon: React.FC<FlameIconProps> = ({
  isActive,
  isAtRisk,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (isActive) {
    return (
      <div className="relative inline-flex items-center justify-center">
        <Flame
          className={`
            ${sizeClasses[size]} text-[#FF8C42] fill-[#FFD93D] stroke-[2.5]
            animate-bounce drop-shadow-[0_2px_4px_rgba(255,140,66,0.5)]
          `}
        />
      </div>
    );
  }

  if (isAtRisk) {
    return (
      <div className="relative inline-flex items-center justify-center opacity-75">
        <Flame
          className={`
            ${sizeClasses[size]} text-[#FF8C42] stroke-[2]
          `}
        />
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center opacity-40">
      <Flame className={`${sizeClasses[size]} text-neutral-500 stroke-[2]`} />
    </div>
  );
};
