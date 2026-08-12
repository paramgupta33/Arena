import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  return (
    <Component
      data-text={text}
      className={`glitch-text font-heading uppercase tracking-widest ${className}`}
    >
      {text}
    </Component>
  );
};
