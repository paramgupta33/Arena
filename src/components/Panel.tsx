import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  code?: string;
  glowColor?: 'green' | 'cyan' | 'magenta' | 'gold' | 'red' | 'none';
  variant?: 'default' | 'dense' | 'outline';
  actions?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  title,
  subtitle,
  code,
  glowColor = 'none',
  variant = 'default',
  actions,
  className = '',
  ...props
}) => {
  const getGlowBorder = () => {
    switch (glowColor) {
      case 'green':
        return 'border-[#00ff88]/50 hover:border-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,0.15)]';
      case 'cyan':
        return 'border-[#00d4ff]/50 hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]';
      case 'magenta':
        return 'border-[#ff00ff]/50 hover:border-[#ff00ff] hover:shadow-[0_0_15px_rgba(255,0,255,0.15)]';
      case 'gold':
        return 'border-[#ffd166]/50 hover:border-[#ffd166] hover:shadow-[0_0_15px_rgba(255,209,102,0.15)]';
      case 'red':
        return 'border-[#ff3366]/50 hover:border-[#ff3366] hover:shadow-[0_0_15px_rgba(255,51,102,0.15)]';
      case 'none':
      default:
        return 'border-[#2a2a3a] hover:border-[#00d4ff]/40';
    }
  };

  return (
    <div
      className={`
        relative bg-[#12121a] border transition-all duration-200 clip-chamfer
        ${getGlowBorder()}
        ${variant === 'dense' ? 'p-3' : 'p-5'}
        ${className}
      `}
      {...props}
    >
      {/* Top Technical Notches */}
      <div className="absolute top-0 right-3 w-8 h-[2px] bg-[#2a2a3a]" />
      <div className="absolute bottom-0 left-3 w-8 h-[2px] bg-[#2a2a3a]" />

      {(title || code || actions) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2a2a3a]">
          <div className="flex items-center space-x-2">
            {code && (
              <span className="font-tech text-xs text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 border border-[#00ff88]/30">
                {code}
              </span>
            )}
            <div>
              {title && (
                <h3 className="font-heading text-sm md:text-base tracking-wider font-bold text-[#e0e0e0] uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-body text-xs text-[#6b7280]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
