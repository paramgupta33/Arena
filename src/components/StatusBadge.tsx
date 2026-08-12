import React from 'react';

export interface StatusBadgeProps {
  label: string;
  status?: 'active' | 'full' | 'maintenance' | 'vip' | 'warning';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status = 'active',
  size = 'md'
}) => {
  const getColors = () => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-[#00ff88]/10',
          text: 'text-[#00ff88]',
          border: 'border-[#00ff88]/40',
          dot: 'bg-[#00ff88]'
        };
      case 'full':
        return {
          bg: 'bg-[#ff3366]/10',
          text: 'text-[#ff3366]',
          border: 'border-[#ff3366]/40',
          dot: 'bg-[#ff3366]'
        };
      case 'vip':
        return {
          bg: 'bg-[#ffd166]/10',
          text: 'text-[#ffd166]',
          border: 'border-[#ffd166]/40',
          dot: 'bg-[#ffd166]'
        };
      case 'warning':
        return {
          bg: 'bg-[#ff00ff]/10',
          text: 'text-[#ff00ff]',
          border: 'border-[#ff00ff]/40',
          dot: 'bg-[#ff00ff]'
        };
      case 'maintenance':
      default:
        return {
          bg: 'bg-[#6b7280]/10',
          text: 'text-[#6b7280]',
          border: 'border-[#6b7280]/40',
          dot: 'bg-[#6b7280]'
        };
    }
  };

  const colors = getColors();

  return (
    <span
      className={`
        inline-flex items-center font-tech uppercase border clip-chamfer-sm tracking-wider
        ${colors.bg} ${colors.text} ${colors.border}
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${colors.dot}`} />
      {label}
    </span>
  );
};
