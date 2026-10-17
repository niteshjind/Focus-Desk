import React from 'react';
import { Modal } from '../ui/Modal';
import { Toggle } from '../ui/Toggle';
import { ColorPicker } from '../ui/ColorPicker';
import { DataManagement } from './DataManagement';
import { useSettingsStore } from '../../store/settingsStore';
import { NoteColor } from '../../types/focusdeck';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const accent = useSettingsStore((s) => s.accent);
  const noteFont = useSettingsStore((s) => s.noteFont);
  const weekStart = useSettingsStore((s) => s.weekStart);
  const dayStartHour = useSettingsStore((s) => s.dayStartHour);
  const clock24h = useSettingsStore((s) => s.clock24h);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const focusAutoHideSeconds = useSettingsStore((s) => s.focusAutoHideSeconds ?? 10);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      subtitle="Customize your focus deck theme and study preferences"
      maxWidth="max-w-lg"
      headerColor="bg-[#B983FF]"
    >
      <div className="flex flex-col gap-5 text-left">
        {/* Accent Color */}
        <ColorPicker
          label="Theme Accent Color"
          value={accent}
          onChange={(col: NoteColor) => updateSettings({ accent: col })}
        />

        {/* Note Typography Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111]">
            Sticky Note Font Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sans', label: 'DM Sans', fontClass: 'font-body' },
              { id: 'mono', label: 'Space Mono', fontClass: 'font-mono' },
              { id: 'hand', label: 'Caveat (Hand)', fontClass: 'font-hand text-base' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateSettings({ noteFont: f.id as any })}
                className={`
                  p-2.5 border-[2px] border-[#111111] transition-all text-xs font-bold
                  ${f.fontClass}
                  ${
                    noteFont === f.id
                      ? 'bg-[#FFD93D] shadow-[3px_3px_0_#111111] -translate-y-0.5'
                      : 'bg-white hover:bg-neutral-50'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences Toggles */}
        <div className="flex flex-col gap-3 pt-3 border-t-[2px] border-[#111111]/10">
          <Toggle
            label="24-Hour Digital Clock"
            description="Display time in 24h format (e.g., 14:30 instead of 02:30 PM)"
            checked={clock24h}
            onChange={(val) => updateSettings({ clock24h: val })}
          />

          <Toggle
            label="Week Starts on Monday"
            description="Calendar first day (unchecked starts on Sunday)"
            checked={weekStart === 1}
            onChange={(val) => updateSettings({ weekStart: val ? 1 : 0 })}
          />

          <div className="flex items-center justify-between gap-4 py-1">
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold text-[#111111]">
                Night Owl Day Boundary (4:00 AM)
              </span>
              <span className="text-xs text-[#111111]/70 font-medium">
                Keep tasks completed past midnight on today's streak
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ dayStartHour: dayStartHour === 4 ? 0 : 4 })}
              className={`
                px-3 py-1.5 border-[2px] border-[#111111] font-heading font-black text-xs uppercase transition-all
                ${dayStartHour === 4 ? 'bg-[#FF8C42] shadow-[2px_2px_0_#111111]' : 'bg-white'}
              `}
            >
              {dayStartHour === 4 ? '4 AM' : 'Midnight'}
            </button>
          </div>

          <Toggle
            label="Reduce Motion"
            description="Disable procedural wallpaper animations and UI bounces"
            checked={reduceMotion}
            onChange={(val) => updateSettings({ reduceMotion: val })}
          />

          {/* Focus Mode Auto-Hide Inactivity Timer */}
          <div className="flex flex-col gap-2 p-3 bg-white border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-[#111111]">
                Focus Mode Auto-Hide UI Timer
              </span>
              <span className="px-2 py-0.5 bg-[#111111] text-[#FFF8E7] font-mono text-xs font-bold">
                {focusAutoHideSeconds === 0 ? 'Disabled' : `${focusAutoHideSeconds}s inactivity`}
              </span>
            </div>
            <p className="text-xs text-[#111111]/70 font-medium">
              After inactivity with study timer running, header and cards smoothly vanish leaving the Liquid Glass center clock. Moving mouse or clicking instantly restores everything!
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {[0, 5, 10, 15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => updateSettings({ focusAutoHideSeconds: sec })}
                  className={`
                    flex-1 py-1 text-xs font-heading font-black uppercase border-[2px] border-[#111111] transition-all cursor-pointer
                    ${
                      focusAutoHideSeconds === sec
                        ? 'bg-[#FFD93D] shadow-[2px_2px_0_#111111] -translate-y-0.5'
                        : 'bg-[#FFF8E7] hover:bg-neutral-100'
                    }
                  `}
                >
                  {sec === 0 ? 'Off' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Local Storage & Backup */}
        <div className="pt-3 border-t-[2px] border-[#111111]/10">
          <DataManagement />
        </div>
      </div>
    </Modal>
  );
};
