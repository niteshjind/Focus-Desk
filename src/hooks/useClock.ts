import { useState, useEffect } from 'react';
import { formatFullDate, formatClockTime } from '../lib/dates';
import { useSettingsStore } from '../store/settingsStore';

export function useClock() {
  const [time, setTime] = useState(new Date());
  const clock24h = useSettingsStore((s) => s.clock24h);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    date: time,
    formattedDate: formatFullDate(time),
    formattedTime: formatClockTime(time, clock24h),
  };
}
