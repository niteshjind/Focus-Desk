import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { WallpaperThumbnail } from './WallpaperThumbnail';
import { UploadZone } from './UploadZone';
import { useWallpaperStore, BUILTIN_WALLPAPERS } from '../../store/wallpaperStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Shuffle, Sliders, Sparkles, FolderUp } from 'lucide-react';

export interface WallpaperPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperPickerModal: React.FC<WallpaperPickerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'builtin' | 'custom'>('builtin');
  const [showControls, setShowControls] = useState(false);

  const activeWallpaperId = useSettingsStore((s) => s.activeWallpaperId);
  const dim = useSettingsStore((s) => s.dim);
  const blur = useSettingsStore((s) => s.blur);
  const speed = useSettingsStore((s) => s.speed);
  const paused = useSettingsStore((s) => s.paused);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const customWallpapers = useWallpaperStore((s) => s.customWallpapers);
  const removeCustomWallpaper = useWallpaperStore((s) => s.removeCustomWallpaper);
  const getAllWallpapers = useWallpaperStore((s) => s.getAllWallpapers);

  const handlePickRandom = () => {
    const all = getAllWallpapers();
    if (all.length === 0) return;
    const random = all[Math.floor(Math.random() * all.length)];
    updateSettings({ activeWallpaperId: random.id });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Wallpapers"
      subtitle="Select a distraction-free ambient canvas or upload your own"
      maxWidth="max-w-2xl"
      headerColor="bg-[#FFD93D]"
    >
      <div className="flex flex-col gap-5">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            tabs={[
              { id: 'builtin', label: 'Animated (10)', icon: <Sparkles className="w-3.5 h-3.5" /> },
              {
                id: 'custom',
                label: `My Wallpapers (${customWallpapers.length})`,
                icon: <FolderUp className="w-3.5 h-3.5" />,
              },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'builtin' | 'custom')}
          />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color={showControls ? 'pink' : 'paper'}
              onClick={() => setShowControls(!showControls)}
              icon={<Sliders className="w-3.5 h-3.5" />}
            >
              Adjust
            </Button>
            <Button
              size="sm"
              color="yellow"
              onClick={handlePickRandom}
              icon={<Shuffle className="w-3.5 h-3.5" />}
            >
              Random
            </Button>
          </div>
        </div>

        {/* Wallpaper Adjustments Drawer */}
        {showControls && (
          <div className="p-4 bg-[#FFF8E7] border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Slider
                label="Dim Overlay"
                value={dim}
                min={0}
                max={80}
                unit="%"
                onChange={(val) => updateSettings({ dim: val })}
              />
              <Slider
                label="Blur Effect"
                value={blur}
                min={0}
                max={20}
                unit="px"
                onChange={(val) => updateSettings({ blur: val })}
              />
              <Slider
                label="Motion Speed"
                value={Number(speed.toFixed(1))}
                min={0.2}
                max={2.0}
                step={0.1}
                unit="x"
                onChange={(val) => updateSettings({ speed: val })}
              />
            </div>
            <div className="pt-2 border-t-[2px] border-[#111111]/10">
              <Toggle
                label="Pause Background Animation"
                description="Freeze background canvas motion for maximum battery saving"
                checked={paused}
                onChange={(val) => updateSettings({ paused: val })}
              />
            </div>
          </div>
        )}

        {/* Tab 1: Built-in Live Procedural Wallpapers */}
        {activeTab === 'builtin' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1">
            {BUILTIN_WALLPAPERS.map((wp) => (
              <WallpaperThumbnail
                key={wp.id}
                wallpaper={wp}
                isActive={activeWallpaperId === wp.id}
                onSelect={(id) => updateSettings({ activeWallpaperId: id })}
              />
            ))}
          </div>
        )}

        {/* Tab 2: Custom Media Uploads */}
        {activeTab === 'custom' && (
          <div className="flex flex-col gap-5">
            <UploadZone />

            {customWallpapers.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Saved Media ({customWallpapers.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto p-1">
                  {customWallpapers.map((wp) => (
                    <WallpaperThumbnail
                      key={wp.id}
                      wallpaper={wp}
                      isActive={activeWallpaperId === wp.id}
                      onSelect={(id) => updateSettings({ activeWallpaperId: id })}
                      onDelete={(id) => removeCustomWallpaper(id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-[#111111]/50 text-center py-2">
                No custom wallpapers uploaded yet. Drop an image, GIF, or video above!
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
