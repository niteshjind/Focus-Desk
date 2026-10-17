import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Download, Upload, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { createExportPayload, validateAndParseImport } from '../../lib/export';
import { useNotesStore } from '../../store/notesStore';
import { useHistoryStore } from '../../store/historyStore';
import { useSettingsStore } from '../../store/settingsStore';

export const DataManagement: React.FC = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const notes = useNotesStore((s) => s.notes);
  const importNotes = useNotesStore((s) => s.importNotes);
  const clearNotes = useNotesStore((s) => s.clearNotes);

  const history = useHistoryStore((s) => s.completedTasks);
  const importHistory = useHistoryStore((s) => s.importHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const settings = useSettingsStore.getState();
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const handleExport = () => {
    const jsonStr = createExportPayload(notes, history, settings);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusdeck-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'Data exported successfully as JSON file.', type: 'success' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = validateAndParseImport(content);
        importNotes(parsed.notes);
        importHistory(parsed.history);
        updateSettings(parsed.settings);
        setMessage({ text: 'Data imported and restored successfully!', type: 'success' });
      } catch (err: any) {
        setMessage({ text: err.message || 'Failed to import JSON file.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetEverything = () => {
    clearNotes();
    clearHistory();
    resetSettings();
    setShowResetConfirm(false);
    setMessage({ text: 'All data has been reset to default state.', type: 'success' });
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="font-heading font-black text-xs uppercase tracking-wider text-[#111111]">
        Backup & Local Data Management
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          size="sm"
          color="paper"
          onClick={handleExport}
          icon={<Download className="w-4 h-4" />}
        >
          Export JSON Backup
        </Button>

        <Button
          size="sm"
          color="paper"
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload className="w-4 h-4" />}
        >
          Import JSON Backup
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>

      <div className="pt-3 border-t-[2px] border-[#111111]/10 flex justify-between items-center">
        <div>
          <div className="text-xs font-bold text-[#FF4D4D]">Danger Zone</div>
          <div className="text-[11px] text-[#111111]/70 font-medium">
            Permanently clear all notes and history
          </div>
        </div>
        <Button
          size="sm"
          variant="danger"
          onClick={() => setShowResetConfirm(true)}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Reset All Data
        </Button>
      </div>

      {message && (
        <div
          className={`p-2.5 border-[2px] border-[#111111] text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-[#6BCB77]/20 text-[#111111]' : 'bg-[#FF4D4D]/20 text-[#FF4D4D]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#6BCB77]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#FF4D4D]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Strong Confirmation Modal for Reset */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset All Data?"
        headerColor="bg-[#FF4D4D]"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col gap-4 text-left">
          <div className="p-3 border-[2px] border-[#111111] bg-[#FF4D4D]/10 text-xs font-bold text-[#111111]">
            ⚠️ This will permanently delete all your active sticky notes, completed history, and personal settings. This cannot be undone!
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t-[2px] border-[#111111]/10">
            <Button size="sm" variant="ghost" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleResetEverything}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
