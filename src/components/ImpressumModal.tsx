import React, { useEffect } from 'react';
import { X, Scale, Mail, MapPin, ShieldCheck, BarChart3 } from 'lucide-react';
import { Language, getTranslations, localizeText } from '../i18n/translations';

interface ImpressumModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ImpressumModal: React.FC<ImpressumModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = getTranslations(language);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[1px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="impressum-modal-title"
    >
      <div
        className="w-full max-w-lg rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2
              id="impressum-modal-title"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {localizeText(language, 'Impressum & Datenschutz', 'Legal Notice & Privacy Policy')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.controls.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm text-slate-700 dark:text-slate-300 max-h-[75vh] overflow-y-auto">
          <div className="rounded border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {localizeText(
                language,
                'Angaben gemäß § 5 DDG & § 18 Abs. 2 MStV',
                'Information pursuant to § 5 DDG & § 18 (2) MStV'
              )}
            </p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Eren Kazokoglu
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
              <span>
                Wiesach 13
                <br />
                73230 Kirchheim unter Teck
                <br />
                {localizeText(language, 'Deutschland', 'Germany')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <a
                href="mailto:info@best-tools.app"
                className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
              >
                info@best-tools.app
              </a>
            </div>
          </div>

          <div className="rounded border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {localizeText(language, 'Datenschutz & lokale Ausführung', 'Privacy & Local Execution')}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {localizeText(
                language,
                'Alle SQL-Abfragen, Übungsdatenbanken, eigene Aufgaben und Snippets werden ausschließlich lokal auf deinem Gerät (WebAssembly / localStorage) verarbeitet. Es findet keine Übertragung deiner SQL-Daten an Server statt.',
                'All SQL queries, practice databases, custom tasks, and snippets are processed strictly locally on your device (WebAssembly / localStorage). No SQL data is transmitted to external servers.'
              )}
            </p>
          </div>

          <div className="rounded border border-slate-200 dark:border-slate-800 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>
                {localizeText(
                  language,
                  'Webanalyse durch selbstgehostetes Umami',
                  'Web Analytics via Self-Hosted Umami'
                )}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {localizeText(
                language,
                'Wir nutzen auf dieser Website das Open-Source-Analysetool Umami, um die Nutzung unserer Website statistisch auszuwerten und unser Angebot zu verbessern. Umami wird vollständig auf unseren eigenen Servern in Deutschland betrieben.',
                'We use the open-source analytics tool Umami on this website to statistically evaluate website usage and improve our offering. Umami is operated exclusively on our own servers in Germany.'
              )}
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {localizeText(
                language,
                'Das Tool verwendet keine Cookies und speichert keine personenbezogenen Daten. Ihre IP-Adresse wird nicht gespeichert, sondern unmittelbar nach dem Aufruf anonymisiert gehasht. Ein Rückschluss auf Ihre Person oder ein seitenübergreifendes Tracking (Cross-Site-Tracking) ist technisch ausgeschlossen.',
                'The tool does not use cookies and does not store any personal data. Your IP address is never stored; instead, it is anonymized and hashed immediately upon access. Identification of your person or cross-site tracking is technically impossible.'
              )}
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {localizeText(
                language,
                'Rechtsgrundlage für die Datenverarbeitung ist unser berechtigtes Interesse an der bedarfsgerechten Gestaltung und Optimierung unseres Webangebots gemäß Art. 6 Abs. 1 lit. f DSGVO.',
                'The legal basis for data processing is our legitimate interest in the needs-based design and optimization of our web offering pursuant to Art. 6(1)(f) GDPR.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {t.controls.close}
          </button>
        </div>
      </div>
    </div>
  );
};
