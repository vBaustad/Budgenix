import React from 'react';

type Direction = 'horizontal' | 'vertical';

interface GradientSeparatorProps {
  direction?: Direction;
  reverse?: boolean;
  className?: string;
}

const GradientSeparator: React.FC<GradientSeparatorProps> = ({
  direction = 'horizontal',
  reverse = false,
  className = '',
}) => {
  const styles =
    direction === 'horizontal' ? 'h-1 w-full' : 'w-1 h-[calc(100vh-2rem)]';

  const start = 'var(--color-primary)'; // DaisyUI primary color
  const end = 'var(--color-primary-content)';   // DaisyUI secondary color

  let gradient = '';
  if (direction === 'horizontal') {
    gradient = reverse
      ? `linear-gradient(to left, ${start}, ${end})`
      : `linear-gradient(to right, ${start}, ${end})`;
  } else {
    gradient = reverse
      ? `linear-gradient(to top, ${start}, ${end})`
      : `linear-gradient(to bottom, ${start}, ${end})`;
  }

  return (
    <div
      className={`${styles} ${className}`}
      style={{ background: gradient }}
    />
  );
};


export default GradientSeparator;
