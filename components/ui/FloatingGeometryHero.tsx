import React, { useEffect, useState } from "react";

export const FloatingGeometryHero: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900 via-neutral-900 to-stone-900 overflow-hidden">
            <svg
                className="absolute inset-0 w-full h-full opacity-30 text-white/10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>
                <path d="M0 100 V 80 Q 25 20 50 80 T 100 80 V 100 Z" fill="url(#grid-grad)" />
            </svg>

            {/* Floating Shapes Container */}
            <div className="absolute inset-0 w-full h-full">

                {/* Large Rotating Ring */}
                <div
                    className="absolute top-1/2 left-1/2 w-[80vh] h-[80vh] border border-white/5 rounded-full"
                    style={{
                        transform: `translate(-50%, -50%) translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) rotate(${mousePos.x * 10}deg)`,
                        transition: 'transform 0.4s ease-out'
                    }}
                ></div>

                <div
                    className="absolute top-1/2 left-1/2 w-[60vh] h-[60vh] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"
                    style={{
                        marginLeft: '-30vh',
                        marginTop: '-30vh',
                    }}
                >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Floating Tetrahedron (Triangle) */}
                <div
                     className="absolute top-1/4 left-1/4 opacity-20 animate-[bounce_8s_infinite] backdrop-blur-sm"
                     style={{
                        transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px) rotate(15deg)`,
                        transition: 'transform 0.5s ease-out'
                     }}
                >
                    <svg width="200" height="200" viewBox="0 0 100 100" className="stroke-white fill-transparent stroke-[0.5]">
                        <path d="M50 10 L90 80 H10 Z" />
                         <path d="M50 10 L50 90" className="stroke-[0.2]" />
                    </svg>
                </div>

                {/* Floating Hexagon */}
                <div
                     className="absolute bottom-1/4 right-1/4 opacity-10 animate-pulse delay-1000"
                     style={{
                        transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px) rotate(-15deg)`,
                        transition: 'transform 0.6s ease-out'
                     }}
                >
                     <svg width="300" height="300" viewBox="0 0 100 100" className="stroke-white fill-transparent stroke-[0.5]">
                        <path d="M25 5 L75 5 L100 50 L75 95 L25 95 L0 50 Z" />
                    </svg>
                </div>

                {/* Connectors / Nodes */}
                 <div
                     className="absolute top-1/3 right-1/3 w-32 h-32 opacity-10"
                      style={{
                        transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 50}px)`,
                        transition: 'transform 0.7s ease-out'
                     }}
                 >
                     <div className="absolute inset-0 border border-t-0 border-r-0 border-white/50 transform rotate-45"></div>
                 </div>

            </div>

             {/* Animated Particles */}
             {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"
                    style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${i * 0.8}s`
                    }}
                />
            ))}
        </div>
    );
};
