import { Moon } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader = ({ message = 'Loading...', size = 'md', fullScreen = false }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const containerSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lavender-50 via-white to-teal-50'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className={`relative ${containerSizeClasses[size]} flex items-center justify-center`}>
        {/* Outer pulsing circle */}
        <div className={`absolute ${containerSizeClasses[size]} rounded-full bg-lavender-200/30 animate-ping`} />
        
        {/* Middle pulsing circle */}
        <div 
          className={`absolute ${containerSizeClasses[size]} rounded-full bg-lavender-300/20 animate-pulse`}
          style={{ animationDelay: '0.3s' }}
        />
        
        {/* Moon icon with gentle rotation */}
        <div className="relative z-10 animate-spin" style={{ animationDuration: '4s', animationTimingFunction: 'ease-in-out' }}>
          <Moon
            className={`${sizeClasses[size]} text-lavender-600 fill-lavender-300/50`}
            strokeWidth={2}
          />
        </div>
      </div>
      
      {/* Loading text */}
      {message && (
        <p className={`mt-6 ${textSizeClasses[size]} font-medium text-lavender-700`}>
          {message}
        </p>
      )}
    </div>
  );
};
