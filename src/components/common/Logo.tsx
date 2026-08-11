import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'stacked';
  theme?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MatchSkillsIcon: React.FC<{ className?: string; color?: string; bg?: string }> = ({
  className = 'h-9 w-9',
  color = '#1e3a5f',
  bg = '#ffffff',
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded Container Box */}
      <rect x="25" y="25" width="450" height="450" rx="100" ry="100" fill={bg} />

      {/* Left Chevron (pointing right) */}
      <path
        d="M 125 135 L 285 250 L 125 365 L 125 295 L 205 250 L 125 205 Z"
        fill={color}
      />

      {/* Right Chevron (pointing left) */}
      <path
        d="M 375 135 L 215 250 L 375 365 L 375 295 L 295 250 L 375 205 Z"
        fill={color}
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'dark',
  className = '',
  size = 'md',
}) => {
  const isDarkTheme = theme === 'dark';
  const textColor = isDarkTheme ? 'text-white' : 'text-[#1e3a5f]';
  const subtextColor = isDarkTheme ? 'text-blue-200' : 'text-slate-500';

  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-[12px] tracking-[0.3em]',
    xl: 'text-[14px] tracking-[0.35em]',
  };

  if (variant === 'icon') {
    return (
      <MatchSkillsIcon
        className={`${iconSizes[size]} ${className}`}
        color={isDarkTheme ? '#1e3a5f' : '#ffffff'}
        bg={isDarkTheme ? '#ffffff' : '#1e3a5f'}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <MatchSkillsIcon
          className={iconSizes[size]}
          color={isDarkTheme ? '#1e3a5f' : '#ffffff'}
          bg={isDarkTheme ? '#ffffff' : '#1e3a5f'}
        />
        <span className={`font-bold tracking-tight mt-3 ${titleSizes[size]} ${textColor}`}>
          MatchSkills
        </span>
        <span className={`font-medium uppercase mt-0.5 ${subtitleSizes[size]} ${subtextColor}`}>
          AI TECH RECRUITMENT
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <MatchSkillsIcon
        className={iconSizes[size]}
        color={isDarkTheme ? '#1e3a5f' : '#ffffff'}
        bg={isDarkTheme ? '#ffffff' : '#1e3a5f'}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight ${titleSizes[size]} ${textColor}`}>
          MatchSkills
        </span>
        <span className={`font-semibold uppercase mt-1 ${subtitleSizes[size]} ${subtextColor}`}>
          AI TECH RECRUITMENT
        </span>
      </div>
    </div>
  );
};
