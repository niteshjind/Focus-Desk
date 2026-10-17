import { describe, it, expect } from 'vitest';
import { createExportPayload, validateAndParseImport } from '../src/lib/export';
import { TaskNote, CompletedTask, Settings } from '../src/types/focusdeck';

describe('Storage & Data Export/Import', () => {
  const mockNotes: TaskNote[] = [
    {
      id: 'note-1',
      body: 'Study Mathematics',
      color: 'yellow',
      position: { x: 100, y: 150, rotation: 1.5, z: 1 },
      createdAt: '2026-10-17T10:00:00Z',
      order: 1,
    },
  ];

  const mockHistory: CompletedTask[] = [
    {
      id: 'note-0',
      body: 'Chemistry Review',
      color: 'blue',
      completedAt: '2026-10-16T18:00:00Z',
      dayKey: '2026-10-16',
    },
  ];

  const mockSettings: Settings = {
    activeWallpaperId: 'rain',
    dim: 20,
    blur: 0,
    speed: 1,
    paused: false,
    accent: 'yellow',
    noteFont: 'sans',
    weekStart: 1,
    dayStartHour: 0,
    clock24h: false,
    reduceMotion: false,
    view: 'board',
    focusAutoHideSeconds: 10,
  };

  it('exports and roundtrips valid FocusDeck JSON', () => {
    const jsonStr = createExportPayload(mockNotes, mockHistory, mockSettings);
    const parsed = validateAndParseImport(jsonStr);

    expect(parsed.version).toBe(1);
    expect(parsed.notes.length).toBe(1);
    expect(parsed.notes[0].body).toBe('Study Mathematics');
    expect(parsed.history.length).toBe(1);
    expect(parsed.settings.accent).toBe('yellow');
  });

  it('throws descriptive error on malformed JSON or invalid schema', () => {
    expect(() => validateAndParseImport('not a json')).toThrow();
    expect(() => validateAndParseImport(JSON.stringify({ notes: 'invalid' }))).toThrow(
      'Missing or invalid notes array'
    );
  });
});
