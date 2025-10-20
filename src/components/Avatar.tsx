import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

export function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? '/placeholder-avatar.svg' : src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 flex-shrink-0`}
      onError={handleError}
      loading="lazy"
    />
  );
}
