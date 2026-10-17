import React from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider font-heading">
        <label className="text-[#111111]">{label}</label>
        <span className="px-2 py-0.5 bg-[#111111] text-[#FFF8E7] text-[11px] font-mono border border-[#111111]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#FFD93D] cursor-pointer h-3 bg-[#FFF8E7] border-[2px] border-[#111111] appearance-none shadow-[2px_2px_0_#111111]"
      />
    </div>
  );
};
