import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UserProfile, UserRole, OfficeBearerBadgeStyle } from '@/lib/types';
import { translations } from '@/lib/i18n/translations';

export type FontSizeOption = 'sm' | 'base' | 'lg' | 'xl';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  availableProfiles: UserProfile[];
  switchUserRole: (roleOrId: string) => Promise<void>;
  badgeStyle: OfficeBearerBadgeStyle;
  setBadgeStyle: (style: OfficeBearerBadgeStyle) => void;
  stateEscalationEnabled: boolean;
  setStateEscalationEnabled: (enabled: boolean) => void;
  t: (section: keyof typeof translations['mr'], key?: string) => any;
  // Accessibility & UI Controls (GIGW 3.0)
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  // Executive Login & Member Portal Modal
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  activeLoginTab: 'entrepreneur' | 'officer';
  setActiveLoginTab: (tab: 'entrepreneur' | 'officer') => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('mr');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<UserProfile[]>([]);
  const [badgeStyle, setBadgeStyleState] = useState<OfficeBearerBadgeStyle>('outlined');
  const [stateEscalationEnabled, setStateEscalationEnabledState] = useState<boolean>(false);

  // Accessibility States
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('base');
  const [highContrast, setHighContrastState] = useState<boolean>(false);

  // Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [activeLoginTab, setActiveLoginTab] = useState<'entrepreneur' | 'officer'>('entrepreneur');

  useEffect(() => {
    // Read saved language or default to 'mr' safely
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLang = localStorage.getItem('bus_lang') as Language;
        if (savedLang && ['mr', 'hi', 'en'].includes(savedLang)) {
          setLangState(savedLang);
        }

        const savedFontSize = localStorage.getItem('bus_font_size') as FontSizeOption;
        if (savedFontSize && ['sm', 'base', 'lg', 'xl'].includes(savedFontSize)) {
          setFontSizeState(savedFontSize);
          updateHtmlFontSize(savedFontSize);
        }

        const savedContrast = localStorage.getItem('bus_high_contrast') === 'true';
        if (savedContrast) {
          setHighContrastState(true);
          document.documentElement.classList.add('high-contrast');
        }
      }
    } catch (e) {
      // Ignore storage access errors
    }

    // Load profiles and settings
    fetch('/api/auth/current-user')
      .then((res) => res.json())
      .then((data) => {
        if (data.allProfiles) {
          setAvailableProfiles(data.allProfiles);
        }
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch((e) => console.error('Failed to load user session', e));

    fetch('/api/settings')
      .then((res) => res.json())
      .then((settings) => {
        if (settings.officeBearerBadgeStyle) {
          setBadgeStyleState(settings.officeBearerBadgeStyle);
        }
        if (settings.stateEscalationEnabled !== undefined) {
          setStateEscalationEnabledState(settings.stateEscalationEnabled);
        }
      })
      .catch((e) => console.error('Failed to load settings', e));
  }, []);

  const updateHtmlFontSize = (size: FontSizeOption) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('text-size-sm', 'text-size-base', 'text-size-lg', 'text-size-xl');
    document.documentElement.classList.add(`text-size-${size}`);
  };

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
    updateHtmlFontSize(size);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('bus_font_size', size);
      }
    } catch (e) {}
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('bus_high_contrast', enabled ? 'true' : 'false');
      }
    } catch (e) {}
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('bus_lang', newLang);
      }
    } catch (e) {}
  };

  const setBadgeStyle = async (newStyle: OfficeBearerBadgeStyle) => {
    setBadgeStyleState(newStyle);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officeBearerBadgeStyle: newStyle }),
    });
  };

  const setStateEscalationEnabled = async (enabled: boolean) => {
    setStateEscalationEnabledState(enabled);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stateEscalationEnabled: enabled }),
    });
  };

  const switchUserRole = async (targetRoleOrId: string) => {
    if (targetRoleOrId === 'visitor') {
      setCurrentUser(null);
      await fetch('/api/auth/current-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '' }),
      });
      return;
    }

    // Match by ID or by role
    const profile =
      availableProfiles.find((p) => p.id === targetRoleOrId) ||
      availableProfiles.find((p) => p.role === targetRoleOrId);

    if (profile) {
      setCurrentUser(profile);
      await fetch('/api/auth/current-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id }),
      });
    }
  };

  const logout = async () => {
    await switchUserRole('visitor');
  };

  const t = (section: keyof typeof translations['mr'], key?: string) => {
    const langDict = translations[lang] || translations['mr'];
    const sec = langDict[section] as any;
    if (!sec) return key || '';
    if (!key) return sec;
    return sec[key] || (translations['mr'] as any)[section]?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        currentUser,
        setCurrentUser,
        availableProfiles,
        switchUserRole,
        badgeStyle,
        setBadgeStyle,
        stateEscalationEnabled,
        setStateEscalationEnabled,
        t,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        loginModalOpen,
        setLoginModalOpen,
        activeLoginTab,
        setActiveLoginTab,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
