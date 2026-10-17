import React from 'react';
import { Search, LayoutGrid, List, Plus, FilterX, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { NoteColor, Priority } from '../../types/focusdeck';
import { useSettingsStore } from '../../store/settingsStore';

export interface NoteFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedColor?: NoteColor;
  onColorChange: (color?: NoteColor) => void;
  selectedPriority?: Priority;
  onPriorityChange: (priority?: Priority) => void;
  onClearAllFilters: () => void;
  onNewNote: () => void;
  filteredCount: number;
  totalCount: number;
}

export const NoteFilterBar: React.FC<NoteFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedColor,
  onColorChange,
  selectedPriority,
  onPriorityChange,
  onClearAllFilters,
  onNewNote,
  filteredCount,
  totalCount,
}) => {
  const view = useSettingsStore((s) => s.view);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const colors: { id: NoteColor; name: string; bg: string }[] = [
    { id: 'yellow', name: 'Yellow', bg: 'bg-[#FFD93D]' },
    { id: 'pink', name: 'Pink', bg: 'bg-[#FF6B9D]' },
    { id: 'blue', name: 'Blue', bg: 'bg-[#4D96FF]' },
    { id: 'green', name: 'Green', bg: 'bg-[#6BCB77]' },
    { id: 'orange', name: 'Orange', bg: 'bg-[#FF8C42]' },
    { id: 'purple', name: 'Purple', bg: 'bg-[#B983FF]' },
  ];

  const priorities: { id: Priority; label: string; name: string }[] = [
    { id: 'low', label: 'Low', name: 'Low Priority' },
    { id: 'medium', label: 'Med', name: 'Medium Priority' },
    { id: 'high', label: 'High', name: 'High Priority' },
  ];

  const isAnyFilterActive = !!searchQuery.trim() || !!selectedColor || !!selectedPriority;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFF8E7] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111]">
      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative min-w-[160px] max-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#111111]/50" />
          <input
            type="text"
            placeholder="Search tasks... (/)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-6 py-1.5 bg-white border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-bold focus:outline-none focus:shadow-[4px_4px_0_#111111] text-[#111111] placeholder:text-[#111111]/40"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-[#111111]/60 hover:text-[#111111]"
              title="Clear search text"
            >
              ✕
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 bg-white p-1 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
          <span className="font-heading font-black text-[9px] uppercase tracking-wider text-[#111111]/60 px-1 select-none">
            Priority:
          </span>
          <Tooltip content="Show all priorities">
            <button
              onClick={() => onPriorityChange(undefined)}
              className={`px-1.5 py-0.5 text-[10px] font-heading font-black uppercase transition-all ${
                !selectedPriority
                  ? 'bg-[#FFD93D] shadow-[1px_1px_0_#111111]'
                  : 'hover:bg-neutral-100 opacity-70'
              }`}
            >
              All
            </button>
          </Tooltip>
          {priorities.map((p) => {
            const isSelected = selectedPriority === p.id;
            return (
              <Tooltip key={p.id} content={`Filter: ${p.name}`}>
                <button
                  onClick={() => onPriorityChange(isSelected ? undefined : p.id)}
                  className={`px-1.5 py-0.5 text-[10px] font-heading font-black uppercase transition-all ${
                    isSelected
                      ? 'bg-[#FFD93D] shadow-[2px_2px_0_#111111] ring-1 ring-black -translate-y-0.5 font-black'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  {p.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Color Filter Swatches */}
        <div className="flex items-center gap-1.5 bg-white p-1 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
          <span className="font-heading font-black text-[9px] uppercase tracking-wider text-[#111111]/60 px-1 select-none">
            Color:
          </span>
          <Tooltip content="Show all colors">
            <button
              onClick={() => onColorChange(undefined)}
              className={`px-1.5 py-0.5 text-[10px] font-heading font-black uppercase transition-all ${
                !selectedColor
                  ? 'bg-[#FFD93D] shadow-[1px_1px_0_#111111]'
                  : 'hover:bg-neutral-100 opacity-70'
              }`}
            >
              All
            </button>
          </Tooltip>
          {colors.map((c) => {
            const isSelected = selectedColor === c.id;
            return (
              <Tooltip key={c.id} content={`Filter: ${c.name} notes`}>
                <button
                  onClick={() => onColorChange(isSelected ? undefined : c.id)}
                  aria-label={`Filter by ${c.name}`}
                  className={`
                    w-5 h-5 border-[2px] border-[#111111] transition-all flex items-center justify-center cursor-pointer
                    ${c.bg}
                    ${
                      isSelected
                        ? 'scale-115 shadow-[2px_2px_0_#111111] ring-2 ring-black -translate-y-0.5'
                        : 'hover:scale-110'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#111111] stroke-[3]" />}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Clear Filters Button (Visible whenever a filter is set) */}
        {isAnyFilterActive && (
          <Tooltip content="Reset all active search and filter constraints">
            <button
              onClick={onClearAllFilters}
              className="px-2.5 py-1 bg-[#FF6B9D] text-[#111111] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] font-heading font-black text-[10px] uppercase flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <FilterX className="w-3 h-3" />
              Reset Filters
            </button>
          </Tooltip>
        )}

        {/* Task Counter Badge */}
        <Tooltip content={isAnyFilterActive ? 'Click to reset filters and view all' : 'Total active tasks'}>
          <button
            onClick={isAnyFilterActive ? onClearAllFilters : undefined}
            className={`
              font-heading font-black text-xs px-2.5 py-1 border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] transition-all
              ${
                isAnyFilterActive
                  ? 'bg-[#FFD93D] text-[#111111] cursor-pointer hover:-translate-y-0.5'
                  : 'bg-white text-[#111111]/80 cursor-default'
              }
            `}
          >
            {isAnyFilterActive ? (
              <span>
                {filteredCount} of {totalCount} tasks
              </span>
            ) : (
              <span>
                {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
              </span>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Right Controls: Board/List View Toggle & New Note */}
      <div className="flex items-center gap-2">
        <div className="flex border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111]">
          <Tooltip content="Board View (Freely drag and arrange notes)">
            <button
              onClick={() => updateSettings({ view: 'board' })}
              className={`p-1.5 transition-all flex items-center gap-1 text-xs font-heading font-black uppercase ${
                view === 'board'
                  ? 'bg-[#FFD93D] text-[#111111]'
                  : 'hover:bg-neutral-100 text-[#111111]/70'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#111111]" />
              <span className="hidden md:inline">Board</span>
            </button>
          </Tooltip>

          <Tooltip content="List View (Compact reorderable list)">
            <button
              onClick={() => updateSettings({ view: 'list' })}
              className={`p-1.5 border-l-[2px] border-[#111111] transition-all flex items-center gap-1 text-xs font-heading font-black uppercase ${
                view === 'list'
                  ? 'bg-[#FFD93D] text-[#111111]'
                  : 'hover:bg-neutral-100 text-[#111111]/70'
              }`}
            >
              <List className="w-4 h-4 text-[#111111]" />
              <span className="hidden md:inline">List</span>
            </button>
          </Tooltip>
        </div>

        <Button
          size="sm"
          color="yellow"
          onClick={onNewNote}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          New Note
        </Button>
      </div>
    </div>
  );
};
