import React from 'react';
import { Wallpaper } from '../../types/focusdeck';
import { Check, Trash2, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface WallpaperThumbnailProps {
  wallpaper: Wallpaper;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Builtin preview gradients
const builtinPreviewGradients: Record<string, string> = {
  rain: 'from-[#101726] to-[#1b2a47]',
  stars: 'from-[#030712] via-[#0b0f19] to-[#090514]',
  aurora: 'from-[#050c18] via-[#10b981] to-[#6366f1]',
  lofiSunset: 'from-[#2b1055] via-[#b83b5e] to-[#ffc764]',
  sakura: 'from-[#2d1b36] via-[#4a2545] to-[#f472b6]',
  matrix: 'from-[#050a08] via-[#14532d] to-[#022c22]',
  particles: 'from-[#09081a] via-[#8b5cf6] to-[#f43f5e]',
  oceanWaves: 'from-[#02182b] via-[#0c6291] to-[#1c8ebf]',
  fireplace: 'from-[#0f0502] via-[#b45309] to-[#ea580c]',
  snowfall: 'from-[#0a1128] via-[#1c2541] to-[#3a506b]',
};

export const WallpaperThumbnail: React.FC<WallpaperThumbnailProps> = ({
  wallpaper,
  isActive,
  onSelect,
  onDelete,
}) => {
  const isBuiltin = wallpaper.kind === 'builtin';
  const previewGradient = isBuiltin
    ? builtinPreviewGradients[wallpaper.builtinKey || 'rain'] || 'from-neutral-900 to-neutral-800'
    : '';

  return (
    <div
      onClick={() => onSelect(wallpaper.id)}
      className={`
        group relative flex flex-col border-[3px] border-[#111111] bg-[#FFF8E7] cursor-pointer
        transition-all text-left overflow-hidden select-none
        ${
          isActive
            ? 'shadow-[5px_5px_0_#111111] -translate-x-1 -translate-y-1 ring-2 ring-black'
            : 'shadow-[3px_3px_0_#111111] hover:shadow-[5px_5px_0_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5'
        }
      `}
    >
      {/* Thumbnail Preview Area */}
      <div className="relative w-full h-24 overflow-hidden border-b-[2px] border-[#111111]">
        {isBuiltin && (
          <div className={`w-full h-full bg-gradient-to-br ${previewGradient} flex items-center justify-center`}>
            <Sparkles className="w-6 h-6 text-white/50" />
          </div>
        )}

        {!isBuiltin && wallpaper.thumbnail && (
          <img src={wallpaper.thumbnail} alt={wallpaper.name} className="w-full h-full object-cover" />
        )}

        {!isBuiltin && !wallpaper.thumbnail && (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/60">
            {wallpaper.kind === 'video' ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>
        )}

        {/* Live Badge */}
        {isBuiltin && (
          <div className="absolute top-1.5 left-1.5">
            <Badge variant="yellow" size="sm">
              LIVE
            </Badge>
          </div>
        )}

        {/* Active Checkmark */}
        {isActive && (
          <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#6BCB77] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center">
            <Check className="w-4 h-4 text-[#111111] stroke-[3]" />
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="p-2 flex items-center justify-between gap-1">
        <span className="font-heading font-black text-xs text-[#111111] truncate uppercase">
          {wallpaper.name}
        </span>
        {onDelete && !isBuiltin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wallpaper.id);
            }}
            className="p-1 hover:bg-[#FF4D4D]/20 text-[#111111] hover:text-[#FF4D4D] transition-colors"
            title="Delete wallpaper"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
