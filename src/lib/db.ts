import Dexie, { type Table } from 'dexie';

export interface WallpaperBlobRecord {
  id: string;
  name: string;
  mimeType: string;
  blob: Blob;
  thumbnail?: string;
  createdAt: string;
}

export class FocusDeckDatabase extends Dexie {
  wallpaperBlobs!: Table<WallpaperBlobRecord, string>;

  constructor() {
    super('FocusDeckDB');
    this.version(1).stores({
      wallpaperBlobs: 'id, name, mimeType, createdAt',
    });
  }
}

export const db = new FocusDeckDatabase();

// Helper functions for wallpaper media storage
export async function saveWallpaperBlob(
  id: string,
  name: string,
  mimeType: string,
  blob: Blob,
  thumbnail?: string
): Promise<void> {
  await db.wallpaperBlobs.put({
    id,
    name,
    mimeType,
    blob,
    thumbnail,
    createdAt: new Date().toISOString(),
  });
}

export async function getWallpaperBlob(id: string): Promise<WallpaperBlobRecord | undefined> {
  return await db.wallpaperBlobs.get(id);
}

export async function deleteWallpaperBlob(id: string): Promise<void> {
  await db.wallpaperBlobs.delete(id);
}

export async function getAllWallpaperBlobs(): Promise<WallpaperBlobRecord[]> {
  return await db.wallpaperBlobs.toArray();
}
