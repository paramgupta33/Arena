import React from 'react';
import { soundEffects } from '../lib/audio';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'special' | 'danger' | 'outline' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  active = false,
  className = '',
  onClick,
  onMouseEnter,
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/60 hover:border-[#00ff88] hover:bg-[#00ff88]/25 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]';
      case 'secondary':
        return 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/60 hover:border-[#00d4ff] hover:bg-[#00d4ff]/25 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]';
      case 'special':
        return 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]/60 hover:border-[#ff00ff] hover:bg-[#ff00ff]/25 hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]';
      case 'danger':
        return 'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/60 hover:border-[#ff3366] hover:bg-[#ff3366]/25 hover:shadow-[0_0_15px_rgba(255,51,102,0.3)]';
      case 'outline':
        return 'bg-[#12121a] text-[#e0e0e0] border-[#2a2a3a] hover:border-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#1c1c2e]';
      case 'muted':
      default:
        return 'bg-[#1c1c2e] text-[#6b7280] border-[#2a2a3a] hover:border-[#6b7280] hover:text-[#e0e0e0]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs tracking-wider';
      case 'lg':
        return 'px-6 py-3.5 text-base tracking-widest';
      case 'md':
      default:
        return 'px-4 py-2.5 text-sm tracking-wider';
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEffects.hover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEffects.click();
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`
        relative inline-flex items-center justify-center font-tech uppercase font-semibold
        transition-all duration-150 ease-out border cursor-pointer clip-chamfer-sm
        select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${active ? 'ring-1 ring-offset-1 ring-offset-[#0a0a0f] ring-current' : ''}
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      {...props}
    >
      {/* Corner Bracket Detail */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-70" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-70" />
      
      {icon && <span className="mr-2 flex items-center justify-center">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
