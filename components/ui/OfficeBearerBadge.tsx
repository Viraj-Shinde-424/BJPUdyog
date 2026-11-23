import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { OfficeBearerBadgeStyle } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

interface OfficeBearerBadgeProps {
  title?: string;
  scope?: string;
  styleOverride?: OfficeBearerBadgeStyle;
  showScope?: boolean;
}

export const OfficeBearerBadge: React.FC<OfficeBearerBadgeProps> = ({
  title = 'पदाधिकारी',
  scope,
  styleOverride,
  showScope = false,
}) => {
  const { badgeStyle, lang } = useApp();
  const currentStyle = styleOverride || badgeStyle || 'outlined';

  const labelText =
    lang === 'en'
      ? 'Office-Bearer'
      : lang === 'hi'
      ? 'पदाधिकारी'
      : 'पदाधिकारी';

  const styleClasses = {
    // Proposed Client Default: small outlined पदाधिकारी label
    outlined:
      'border border-[#E35914] text-[#E35914] bg-orange-50/60 hover:bg-orange-100/60 rounded-md',
    // Solid subtle tone
    solid:
      'bg-orange-100 text-[#C84B0E] border border-orange-200 rounded-md',
    // Accent bar
    'accent-bar':
      'border-l-2 border-l-[#E35914] border-t border-r border-b border-slate-200 text-slate-800 bg-slate-50 rounded-r-md pl-1.5 pr-2',
    // Pill fill
    'pill-fill':
      'bg-[#E35914] text-white rounded-full px-2.5 shadow-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold py-0.5 px-2 tracking-wide leading-none transition-all ${styleClasses[currentStyle]}`}
      title={scope ? `${labelText}: ${scope}` : labelText}
    >
      <ShieldCheck className="w-3 h-3 flex-shrink-0" />
      <span>{labelText}</span>
      {showScope && scope && (
        <span className="opacity-80 text-[10px] ml-0.5 hidden sm:inline">
          • {scope}
        </span>
      )}
    </span>
  );
};
