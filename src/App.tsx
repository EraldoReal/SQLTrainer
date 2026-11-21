import React, { useCallback, useEffect, useState } from 'react';
import type { Language } from './i18n/translations';
import { LandingPage } from './pages/LandingPage';
import { SeoSubpage, type SeoRoute } from './pages/SeoSubpage';
import { TrainerPage } from './pages/TrainerPage';

function isTauriEnvironment(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

const SEO_ROUTES: ReadonlySet<string> = new Set<SeoRoute>([
  '/mysql-ueben',
  '/sql-joins-lernen',
  '/sql-abitur-aufgaben',
  '/faq',
]);

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

export function App(): React.ReactElement {
  const inTauri = isTauriEnvironment();

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sql_trainer_lang');
      return saved === 'en' ? 'en' : 'de';
    } catch {
      return 'de';
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('sql_trainer_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('sql_trainer_theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('sql_trainer_lang', language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    if (inTauri) return;
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [inTauri]);

  const navigate = useCallback(
    (path: string) => {
      if (inTauri) return;
      const target = normalizePath(path);
      if (target !== pathname) {
        window.history.pushState({}, '', target);
        setPathname(target);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    [inTauri, pathname]
  );

  if (inTauri || pathname === '/app') {
    return (
      <TrainerPage
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        onNavigate={inTauri ? undefined : navigate}
      />
    );
  }

  if (SEO_ROUTES.has(pathname)) {
    return (
      <SeoSubpage
        route={pathname as SeoRoute}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        navigate={navigate}
      />
    );
  }

  return (
    <LandingPage
      language={language}
      onLanguageChange={setLanguage}
      theme={theme}
      onThemeChange={setTheme}
      navigate={navigate}
    />
  );
}

export default App;
