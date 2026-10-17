import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[#FFF8E7] text-[#111111] px-3 py-2 text-sm font-medium
            border-[3px] border-[#111111] shadow-[3px_3px_0_#111111]
            focus:outline-none focus:bg-white focus:shadow-[5px_5px_0_#111111] focus:-translate-x-[1px] focus:-translate-y-[1px]
            transition-all placeholder:text-[#111111]/40
            ${error ? 'border-[#FF4D4D]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs font-bold text-[#FF4D4D]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
