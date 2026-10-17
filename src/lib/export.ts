import { TaskNote, CompletedTask, Settings } from '../types/focusdeck';

export interface FocusDeckExportData {
  version: 1;
  exportedAt: string;
  notes: TaskNote[];
  history: CompletedTask[];
  settings: Settings;
}

export function createExportPayload(
  notes: TaskNote[],
  history: CompletedTask[],
  settings: Settings
): string {
  const payload: FocusDeckExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    notes,
    history,
    settings,
  };
  return JSON.stringify(payload, null, 2);
}

export function validateAndParseImport(jsonStr: string): FocusDeckExportData {
  const data = JSON.parse(jsonStr);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid JSON data format');
  }
  if (!Array.isArray(data.notes)) {
    throw new Error('Missing or invalid notes array');
  }
  if (!Array.isArray(data.history)) {
    throw new Error('Missing or invalid history array');
  }
  if (!data.settings || typeof data.settings !== 'object') {
    throw new Error('Missing or invalid settings object');
  }
  return data as FocusDeckExportData;
}
