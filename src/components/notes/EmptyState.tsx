import React from 'react';
import { Button } from '../ui/Button';
import { Coffee, Plus, FilterX, Sparkles } from 'lucide-react';

export interface EmptyStateProps {
  onNewNote: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onNewNote,
  isFiltered = false,
  onClearFilters,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#FFF8E7] border-[3px] border-[#111111] shadow-[6px_6px_0_#111111] text-center max-w-sm mx-auto my-12 select-none">
        <div className="w-16 h-16 bg-[#FF6B9D] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] flex items-center justify-center mb-4 -rotate-3">
          <FilterX className="w-8 h-8 text-[#111111]" />
        </div>
        <h3 className="font-heading font-black text-lg uppercase tracking-wide mb-1 text-[#111111]">
          No Matching Tasks
        </h3>
        <p className="text-xs font-bold text-[#111111]/70 mb-4 max-w-xs">
          No notes match your selected priority, color swatch, or search keyword.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {onClearFilters && (
            <Button
              size="md"
              color="yellow"
              onClick={onClearFilters}
              icon={<FilterX className="w-4 h-4" />}
            >
              Clear Active Filters
            </Button>
          )}
          <Button
            size="md"
            color="paper"
            onClick={onNewNote}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            New Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#FFF8E7] border-[3px] border-[#111111] shadow-[6px_6px_0_#111111] text-center max-w-md mx-auto my-12 select-none">
      <div className="w-16 h-16 bg-[#FFD93D] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] flex items-center justify-center mb-4 rotate-3">
        <Coffee className="w-8 h-8 text-[#111111]" />
      </div>
      <h3 className="font-heading font-black text-lg uppercase tracking-wide mb-1 text-[#111111]">
        Your board is empty
      </h3>
      <p className="text-xs font-bold text-[#111111]/70 mb-5 max-w-xs">
        Suspiciously peaceful... Click below to add your first study task or load sample study notes to explore!
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          size="md"
          color="yellow"
          onClick={onNewNote}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          Create Note (N)
        </Button>
        {onLoadSamples && (
          <Button
            size="md"
            color="blue"
            onClick={onLoadSamples}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Load Sample Notes
          </Button>
        )}
      </div>
    </div>
  );
};
