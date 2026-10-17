import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  headerColor?: string;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  headerAction,
  children,
  headerColor = 'bg-[#FFD93D]',
  className = '',
  bodyClassName = 'p-4',
}) => {
  return (
    <div
      className={`
        bg-[#FFF8E7] border-[3px] border-[#111111] shadow-[6px_6px_0_#111111]
        flex flex-col overflow-hidden text-[#111111] ${className}
      `}
    >
      {(title || headerAction) && (
        <div
          className={`
            border-b-[3px] border-[#111111] px-4 py-2.5 flex items-center justify-between
            select-none ${headerColor}
          `}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {icon && <span className="shrink-0">{icon}</span>}
            <div className="truncate">
              {title && <h3 className="font-heading font-black text-sm tracking-wide uppercase truncate">{title}</h3>}
              {subtitle && <p className="text-[11px] text-[#111111]/80 font-medium truncate">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="shrink-0 ml-2">{headerAction}</div>}
        </div>
      )}
      <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
    </div>
  );
};
