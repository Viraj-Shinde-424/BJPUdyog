import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5 font-semibold tracking-tight shadow-xs',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-xl gap-2 font-semibold tracking-tight shadow-sm',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl gap-2.5 font-bold tracking-tight shadow-md',
  };

  const variantStyles = {
    // Primary #E35914: Main action, active navigation, selected controls
    primary:
      'bg-gradient-to-r from-[#E35914] to-[#F06622] text-white hover:from-[#C84B0E] hover:to-[#E35914] focus-visible:ring-[#E35914] shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 border border-orange-400/30',
    // Secondary #136938: Confirmed states and secondary accents
    secondary:
      'bg-gradient-to-r from-[#136938] to-[#1A8247] text-white hover:from-[#0E522B] hover:to-[#136938] focus-visible:ring-[#136938] shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 border border-emerald-500/30',
    // Inverted #111827: Main text, icons and inverted buttons
    inverted:
      'bg-[#0F172A] text-white hover:bg-slate-800 focus-visible:ring-slate-900 shadow-md shadow-slate-900/20 hover:shadow-lg border border-slate-700/50',
    // Outlined: Pale blue-grey panel accent with primary or neutral border
    outlined:
      'bg-white/90 border border-slate-300 text-slate-800 hover:border-[#E35914] hover:text-[#E35914] hover:bg-orange-50/50 focus-visible:ring-[#E35914] shadow-2xs hover:shadow-xs',
    // Tertiary #F59E0B: Pending items & attention states with a text label
    tertiary:
      'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-slate-950 hover:from-[#D97706] hover:to-[#F59E0B] focus-visible:ring-[#F59E0B] font-bold shadow-md shadow-amber-500/20 hover:shadow-lg border border-amber-300/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
