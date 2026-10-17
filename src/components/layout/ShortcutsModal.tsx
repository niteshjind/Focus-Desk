import { Modal } from '../ui/Modal';

export interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'N', desc: 'Create a new sticky note' },
  { key: 'W', desc: 'Open live wallpaper picker' },
  { key: 'F', desc: 'Toggle single-task Focus Mode' },
  { key: 'C', desc: 'Jump to calendar work log' },
  { key: '/', desc: 'Quick search tasks' },
  { key: 'Esc', desc: 'Close dialogs / exit Focus Mode' },
  { key: '?', desc: 'Show this keyboard shortcuts cheat sheet' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      subtitle="Supercharge your study flow with quick keys"
      maxWidth="max-w-md"
      headerColor="bg-[#4D96FF]"
    >
      <div className="flex flex-col gap-2.5 text-left">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between p-2.5 border-[2px] border-[#111111] bg-white shadow-[2px_2px_0_#111111]"
          >
            <span className="text-xs font-bold text-[#111111]">{s.desc}</span>
            <kbd className="px-2.5 py-1 bg-[#111111] text-[#FFF8E7] font-mono font-bold text-xs border border-[#111111] shadow-[1px_1px_0_#111111]">
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
