import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
      <div className="flex flex-col text-left">
        {label && <span className="font-heading text-sm font-bold text-[#111111]">{label}</span>}
        {description && <span className="text-xs text-[#111111]/70 font-medium">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative w-14 h-8 border-[3px] border-[#111111] transition-colors
          ${checked ? 'bg-[#6BCB77]' : 'bg-[#FFF8E7]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-[2px_2px_0_#111111] cursor-pointer'}
        `}
      >
        <span
          className={`
            absolute top-0.5 w-6 h-6 bg-[#111111] border-[2px] border-white transition-transform
            ${checked ? 'left-6 bg-[#111111]' : 'left-0.5'}
          `}
        />
      </button>
    </label>
  );
};
