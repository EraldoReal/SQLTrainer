import { isTauriEnvironment } from './fileManager';

export interface DesktopUpdateInfo {
  available: boolean;
  currentVersion: string;
  version?: string;
  notes?: string;
  installAndRestart?: (onProgress?: (percent: number | null) => void) => Promise<void>;
}

export async function getDesktopAppVersion(): Promise<string> {
  if (!isTauriEnvironment()) return '1.0.0';
  try {
    const { getVersion } = await import('@tauri-apps/api/app');
    return await getVersion();
  } catch {
    return '1.0.0';
  }
}

export async function checkForDesktopUpdate(): Promise<DesktopUpdateInfo> {
  const currentVersion = await getDesktopAppVersion();
  if (!isTauriEnvironment()) {
    return { available: false, currentVersion };
  }

  const { check } = await import('@tauri-apps/plugin-updater');
  const { relaunch } = await import('@tauri-apps/plugin-process');

  const update = await check();
  if (!update) {
    return { available: false, currentVersion };
  }

  return {
    available: true,
    currentVersion,
    version: update.version,
    notes: update.body ?? undefined,
    installAndRestart: async (onProgress) => {
      let downloaded = 0;
      let contentLength = 0;
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          contentLength = event.data.contentLength ?? 0;
          onProgress?.(contentLength > 0 ? 0 : null);
        } else if (event.event === 'Progress') {
          downloaded += event.data.chunkLength;
          if (contentLength > 0) {
            onProgress?.(Math.min(100, Math.round((downloaded / contentLength) * 100)));
          } else {
            onProgress?.(null);
          }
        } else if (event.event === 'Finished') {
          onProgress?.(100);
        }
      });
      await relaunch();
    },
  };
}
