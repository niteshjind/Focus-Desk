import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { saveWallpaperBlob } from '../../lib/db';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Wallpaper } from '../../types/focusdeck';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
];

export const UploadZone: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addCustomWallpaper = useWallpaperStore((s) => s.addCustomWallpaper);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const generateVideoThumbnail = (videoBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(videoBlob);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = 0.5;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, 160, 90);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve('');
        }
        URL.revokeObjectURL(url);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  };

  const generateImageThumbnail = (imageBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(imageBlob);
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw aspect fill
          const scale = Math.max(160 / img.width, 90 / img.height);
          const x = (160 - img.width * scale) / 2;
          const y = (90 - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve('');
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  };

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError('File exceeds 50MB limit. Please choose a smaller file.');
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload JPG, PNG, WebP, GIF, MP4, or WebM.');
      return;
    }

    setIsProcessing(true);
    try {
      const blobKey = 'blob-' + Math.random().toString(36).substring(2, 9);
      const isVideo = file.type.startsWith('video/');

      let thumbnail = '';
      if (isVideo) {
        thumbnail = await generateVideoThumbnail(file);
      } else {
        thumbnail = await generateImageThumbnail(file);
      }

      await saveWallpaperBlob(blobKey, file.name, file.type, file, thumbnail);

      const newWallpaper: Wallpaper = {
        id: 'custom-' + Math.random().toString(36).substring(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ''),
        kind: isVideo ? 'video' : 'image',
        blobKey,
        thumbnail,
        createdAt: new Date().toISOString(),
      };

      addCustomWallpaper(newWallpaper);
      updateSettings({ activeWallpaperId: newWallpaper.id });
    } catch (err) {
      console.error(err);
      setError('Failed to process upload. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    const isVideo = trimmed.match(/\.(mp4|webm)$/i);
    const newWallpaper: Wallpaper = {
      id: 'url-' + Math.random().toString(36).substring(2, 9),
      name: 'Web Media',
      kind: isVideo ? 'video' : 'url',
      url: trimmed,
      createdAt: new Date().toISOString(),
    };

    addCustomWallpaper(newWallpaper);
    updateSettings({ activeWallpaperId: newWallpaper.id });
    setUrlInput('');
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-[3px] border-dashed border-[#111111] p-6 text-center cursor-pointer transition-all
          ${isDragging ? 'bg-[#FFD93D]/30 -translate-y-1 shadow-[4px_4px_0_#111111]' : 'bg-[#FFF8E7] hover:bg-white'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          accept={ALLOWED_MIME_TYPES.join(',')}
          className="hidden"
        />
        <Upload className="w-8 h-8 mx-auto mb-2 text-[#111111]" />
        <div className="font-heading font-black text-sm uppercase tracking-wide">
          {isProcessing ? 'Processing File...' : 'Drop image, GIF, or video here'}
        </div>
        <p className="text-xs font-semibold text-[#111111]/70 mt-1">
          JPG, PNG, WebP, GIF, MP4, WebM (Max 50MB)
        </p>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <Input
          placeholder="Or paste image / video link URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" color="blue" icon={<LinkIcon className="w-4 h-4" />}>
          Add URL
        </Button>
      </form>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-[#FF4D4D]/20 border-[2px] border-[#FF4D4D] text-[#111111] text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-[#FF4D4D] shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
