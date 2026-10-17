import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer, Play, Pause, RotateCcw, Sliders } from 'lucide-react';
import { useTimerStore } from '../../store/timerStore';

export const PomodoroWidget: React.FC = () => {
  const mode = useTimerStore((s) => s.mode);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const totalDuration = useTimerStore((s) => s.totalDuration);
  const isRunning = useTimerStore((s) => s.isRunning);
  const sessionsCompleted = useTimerStore((s) => s.sessionsCompleted);
  const setMode = useTimerStore((s) => s.setMode);
  const setCustomMinutes = useTimerStore((s) => s.setCustomMinutes);
  const adjustMinutes = useTimerStore((s) => s.adjustMinutes);
  const startTimer = useTimerStore((s) => s.startTimer);
  const pauseTimer = useTimerStore((s) => s.pauseTimer);
  const resetTimer = useTimerStore((s) => s.resetTimer);

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [manualMinutesInput, setManualMinutesInput] = useState('25');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const safeTotal = totalDuration || 1;
  const progressPercent = Math.min(100, Math.max(0, ((safeTotal - timeLeft) / safeTotal) * 100));

  const handleSaveManualTime = (e?: React.FormEvent) => {
    e?.preventDefault();
    const parsed = parseInt(manualMinutesInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 360) {
      setCustomMinutes(parsed);
      setIsEditingTime(false);
    }
  };

  return (
    <Card
      title="Study Timer"
      icon={<Timer className="w-4 h-4 text-[#111111]" />}
      headerColor="bg-[#FFD93D]"
      className="w-full"
      bodyClassName="p-3"
      headerAction={
        sessionsCompleted > 0 && (
          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-[#111111] text-[#FFF8E7]">
            {sessionsCompleted} 🍅
          </span>
        )
      }
    >
      <div className="flex flex-col gap-3 text-left">
        {/* Preset Tabs + Custom Mode */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white border-[2px] border-[#111111]">
          <button
            onClick={() => {
              setMode('focus');
              setIsEditingTime(false);
            }}
            className={`py-1 font-heading text-[11px] font-black uppercase transition-all ${
              mode === 'focus' ? 'bg-[#FFD93D] shadow-[2px_2px_0_#111111]' : 'hover:bg-neutral-100'
            }`}
          >
            25m
          </button>
          <button
            onClick={() => {
              setMode('short');
              setIsEditingTime(false);
            }}
            className={`py-1 font-heading text-[11px] font-black uppercase transition-all ${
              mode === 'short' ? 'bg-[#6BCB77] shadow-[2px_2px_0_#111111]' : 'hover:bg-neutral-100'
            }`}
          >
            5m
          </button>
          <button
            onClick={() => {
              setMode('long');
              setIsEditingTime(false);
            }}
            className={`py-1 font-heading text-[11px] font-black uppercase transition-all ${
              mode === 'long' ? 'bg-[#4D96FF] shadow-[2px_2px_0_#111111]' : 'hover:bg-neutral-100'
            }`}
          >
            15m
          </button>
          <button
            onClick={() => {
              setIsEditingTime(true);
              setManualMinutesInput(String(Math.ceil(timeLeft / 60)));
            }}
            className={`py-1 font-heading text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
              mode === 'custom' || isEditingTime ? 'bg-[#FF8C42] shadow-[2px_2px_0_#111111]' : 'hover:bg-neutral-100'
            }`}
          >
            <Sliders className="w-3 h-3" />
            Set
          </button>
        </div>

        {/* Digital Time Display (Click to edit manually when paused) */}
        <div className="p-3 bg-white border-[2px] border-[#111111] shadow-[3px_3px_0_#111111] text-center relative group">
          {isEditingTime ? (
            <form onSubmit={handleSaveManualTime} className="flex items-center justify-center gap-2 py-1">
              <input
                type="number"
                min="1"
                max="360"
                value={manualMinutesInput}
                onChange={(e) => setManualMinutesInput(e.target.value)}
                autoFocus
                className="w-20 px-2 py-1 font-mono font-black text-2xl border-[2px] border-[#111111] bg-[#FFF8E7] text-center focus:outline-none"
              />
              <span className="font-heading font-black text-xs uppercase text-[#111111]">min</span>
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#6BCB77] text-[#111111] font-heading font-black text-xs uppercase border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] active:translate-y-0.5 active:shadow-none"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTime(false)}
                className="p-1 text-xs font-bold text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </form>
          ) : (
            <div>
              <div
                onClick={() => {
                  if (!isRunning) {
                    setIsEditingTime(true);
                    setManualMinutesInput(String(Math.ceil(timeLeft / 60)));
                  }
                }}
                className={`font-mono font-black text-4xl text-[#111111] tracking-wider select-none ${
                  !isRunning ? 'cursor-pointer hover:text-[#FF8C42] transition-colors' : ''
                }`}
                title={!isRunning ? 'Click to set time manually' : undefined}
              >
                {timeString}
              </div>
              {!isRunning && (
                <span className="text-[10px] font-heading font-bold text-[#111111]/50 uppercase tracking-wider block mt-0.5">
                  Click digits to set custom time
                </span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full h-3 mt-2 bg-neutral-200 border-[2px] border-[#111111] overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                mode === 'short' ? 'bg-[#6BCB77]' : mode === 'long' ? 'bg-[#4D96FF]' : 'bg-[#FFD93D]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Stepper Buttons: [-5m] [-1m] [+1m] [+5m] */}
        <div className="flex items-center justify-between gap-1 px-1">
          <span className="text-[10px] font-heading font-black uppercase text-[#111111]/60">
            Adjust:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => adjustMinutes(-5)}
              className="px-1.5 py-0.5 bg-white border border-[#111111] font-mono text-[10px] font-bold shadow-[1px_1px_0_#111111] hover:bg-neutral-100 active:translate-y-0.5 cursor-pointer"
              title="Subtract 5 minutes"
            >
              -5m
            </button>
            <button
              onClick={() => adjustMinutes(-1)}
              className="px-1.5 py-0.5 bg-white border border-[#111111] font-mono text-[10px] font-bold shadow-[1px_1px_0_#111111] hover:bg-neutral-100 active:translate-y-0.5 cursor-pointer"
              title="Subtract 1 minute"
            >
              -1m
            </button>
            <button
              onClick={() => adjustMinutes(1)}
              className="px-1.5 py-0.5 bg-white border border-[#111111] font-mono text-[10px] font-bold shadow-[1px_1px_0_#111111] hover:bg-neutral-100 active:translate-y-0.5 cursor-pointer"
              title="Add 1 minute"
            >
              +1m
            </button>
            <button
              onClick={() => adjustMinutes(5)}
              className="px-1.5 py-0.5 bg-white border border-[#111111] font-mono text-[10px] font-bold shadow-[1px_1px_0_#111111] hover:bg-neutral-100 active:translate-y-0.5 cursor-pointer"
              title="Add 5 minutes"
            >
              +5m
            </button>
          </div>
        </div>

        {/* Timer Action Controls: Start Focus / Pause */}
        <div className="flex items-center justify-center gap-2 pt-1 border-t-[2px] border-[#111111]/10">
          <Button
            size="sm"
            color={isRunning ? 'orange' : 'green'}
            onClick={() => (isRunning ? pauseTimer() : startTimer())}
            icon={isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isRunning ? 'Pause' : 'Start Focus'}
          </Button>

          <Button
            size="sm"
            variant="icon"
            color="paper"
            onClick={resetTimer}
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
