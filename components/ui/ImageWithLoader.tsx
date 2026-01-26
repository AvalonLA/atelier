import React, { useState, useRef } from 'react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ 
  src, 
  alt, 
  className,
  containerClassName,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-900 ${containerClassName || ''}`}
      onMouseMove={handleMouseMove}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {/* Futuristic Loader */}
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Dynamic Vectors */}
             <svg 
               className="w-full h-full max-w-[200px] max-h-[200px] text-white/30" 
               viewBox="0 0 200 200" 
               fill="none" 
               xmlns="http://www.w3.org/2000/svg"
             >
                {/* Outer Ring */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  strokeDasharray="4 4"
                  className="animate-[spin_20s_linear_infinite]"
                  style={{
                    transformOrigin: 'center center',
                    transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px) rotate(0deg)`,
                  }}
                />
                
                {/* Middle Hexagon - approximate */}
                <path
                  d="M100 20 L170 60 V140 L100 180 L30 140 V60 L100 20Z"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="opacity-60"
                  style={{
                      transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
                      transition: 'transform 0.2s ease-out'
                  }}
                />

                {/* Inner Rotating Triangle */}
                <path
                   d="M100 40 L152 130 H48 L100 40Z"
                   stroke="currentColor"
                   strokeWidth="1"
                   className="animate-[spin_10s_linear_infinite_reverse] opacity-80"
                   style={{
                       transformOrigin: 'center center',
                       transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                       transition: 'transform 0.2s ease-out'
                   }}
                />

                {/* Center Core */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="5" 
                  fill="currentColor"
                  className="animate-pulse"
                />
             </svg>
             
             <div className="absolute bottom-10 left-0 right-0 text-center">
                 <div className="inline-flex space-x-1">
                    <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce delay-300"></div>
                 </div>
             </div>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};
