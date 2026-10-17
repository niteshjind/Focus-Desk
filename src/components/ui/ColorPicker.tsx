import React from 'react';
import { NoteColor } from '../../types/focusdeck';
import { Check } from 'lucide-react';

export interface ColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  colors?: NoteColor[];
  label?: string;
}

const colorMap: Record<NoteColor, { bg: string; name: string }> = {
  yellow: { bg: 'bg-[#FFD93D]', name: 'Yellow' },
  pink: { bg: 'bg-[#FF6B9D]', name: 'Pink' },
  blue: { bg: 'bg-[#4D96FF]', name: 'Blue' },
  green: { bg: 'bg-[#6BCB77]', name: 'Green' },
  orange: { bg: 'bg-[#FF8C42]', name: 'Orange' },
  purple: { bg: 'bg-[#B983FF]', name: 'Purple' },
};

const allColors: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  colors = allColors,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111]">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = value === color;
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={colorMap[color].name}
              className={`
                w-8 h-8 border-[3px] border-[#111111] transition-transform flex items-center justify-center cursor-pointer
                ${colorMap[color].bg}
                ${isSelected ? 'shadow-[4px_4px_0_#111111] -translate-x-0.5 -translate-y-0.5 ring-2 ring-black ring-offset-2' : 'shadow-[2px_2px_0_#111111] hover:scale-105'}
              `}
            >
              {isSelected && <Check className="w-4 h-4 text-[#111111] stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
