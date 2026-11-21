import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Terminal, Copy, Check, ExternalLink, Download, Monitor, Apple } from 'lucide-react';
import type { Language } from '../i18n/translations';

export type DownloadPlatform = 'macos' | 'windows';

interface DownloadGatekeeperModalProps {
  isOpen: boolean;
  platform: DownloadPlatform;
  language: Language;
  onClose: () => void;
}

const RELEASE_URLS: Record<DownloadPlatform, string> = {
  macos: 'https://sql.best-tools.app/downloads/SQL-Trainer_1.0.1_aarch64.dmg',
  windows: 'https://sql.best-tools.app/downloads/SQL-Trainer_1.0.1_x64-setup.exe',
};

export const DownloadGatekeeperModal: React.FC<DownloadGatekeeperModalProps> = ({
  isOpen,
  platform,
  language,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const isEn = language === 'en';

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const xattrCommand = 'xattr -cr /Applications/SQL-Trainer.app';

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(xattrCommand);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            {platform === 'macos' ? (
              <Apple className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            ) : (
              <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <h2
              id="download-modal-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {platform === 'macos'
                ? isEn
                  ? 'Download SQL-Trainer for macOS (.dmg)'
                  : 'SQL-Trainer für macOS herunterladen (.dmg)'
                : isEn
                  ? 'Download SQL-Trainer for Windows (.exe)'
                  : 'SQL-Trainer für Windows herunterladen (.exe)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close' : 'Schließen'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                {isEn
                  ? 'Security Notice (No Paid Developer Certificate / No Automated Virus Scan)'
                  : 'Sicherheitshinweis (Ohne kostenpflichtiges Entwicklerzertifikat)'}
              </p>
              <p className="text-amber-800 dark:text-amber-300/90">
                {isEn
                  ? 'SQL-Trainer is a free, open-source educational desktop app. Because no paid Apple Developer or Microsoft EV certificate was purchased, the installers are not pre-verified by Apple Notarization or Microsoft SmartScreen/store virus scans. There are of course no viruses inside — this notice explains how to acknowledge the standard OS warning on first launch.'
                  : 'Der SQL-Trainer ist eine kostenlose Open-Source-Lernanwendung. Da kein kostenpflichtiges Apple- oder Microsoft-Entwicklerprogramm bezahlt wurde, sind die Dateien nicht durch Apple Notarization oder Microsoft SmartScreen vorab auf Virenscans zertifiziert. Es sind selbstverständlich keine Viren enthalten — diese Meldung dient nur zur Kenntnisnahme, wie du die Standard-Warnung beim ersten Start umgehst.'}
              </p>
            </div>
          </div>

          {platform === 'macos' ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {isEn ? 'How to open on macOS (Gatekeeper):' : 'So startest du die App unter macOS (Gatekeeper):'}
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>
                  {isEn
                    ? 'Open the .dmg and drag SQL-Trainer into Applications.'
                    : 'Öffne die .dmg-Datei und ziehe SQL-Trainer in den Programme-Ordner.'}
                </li>
                <li>
                  {isEn
                    ? 'Right-click (or Control-click) SQL-Trainer.app and choose "Open", or allow it in System Settings → Privacy & Security.'
                    : 'Mache einen Rechtsklick (bzw. Ctrl-Klick) auf SQL-Trainer.app → „Öffnen“, oder erlaube die App unter Systemeinstellungen → Datenschutz & Sicherheit.'}
                </li>
                <li>
                  {isEn
                    ? 'Alternatively, remove the quarantine flag in Terminal:'
                    : 'Alternativ kannst du das Quarantäne-Attribut im Terminal entfernen:'}
                </li>
              </ol>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-950 text-slate-100 px-3 py-2 font-mono text-xs">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <code className="whitespace-nowrap">{xattrCommand}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] shrink-0 cursor-pointer"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCmd ? (isEn ? 'Copied' : 'Kopiert') : isEn ? 'Copy' : 'Kopieren'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {isEn ? 'How to open on Windows (SmartScreen):' : 'So startest du die App unter Windows (SmartScreen):'}
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>
                  {isEn
                    ? 'Download and run the SQL-Trainer installer (.exe).'
                    : 'Lade das Installationsprogramm (.exe) herunter und starte es.'}
                </li>
                <li>
                  {isEn
                    ? 'If Microsoft Defender SmartScreen appears ("Windows protected your PC"), click "More info".'
                    : 'Falls Microsoft Defender SmartScreen erscheint („Der Computer wurde durch Windows geschützt“), klicke auf „Weitere Informationen“.'}
                </li>
                <li>
                  {isEn
                    ? 'Click "Run anyway" to launch the installer.'
                    : 'Klicke anschließend auf „Trotzdem ausführen“.'}
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isEn ? 'No installation needed in browser mode.' : 'Im Browser-Modus ist gar kein Download nötig.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isEn ? 'Close' : 'Schließen'}
            </button>
            <a
              href={RELEASE_URLS[platform]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {platform === 'macos'
                ? isEn
                  ? 'Go to macOS Release'
                  : 'Zum macOS-Download'
                : isEn
                  ? 'Go to Windows Release'
                  : 'Zum Windows-Download'}
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
