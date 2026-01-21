import React, { useEffect, useRef, useState } from 'react';

const VisionSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                // We want the image to move slower than scroll (background parallax).
                // As we scroll down (rect.top decreases), we want the image to move DOWN relative to container (translateY increases).
                // Example: rect.top goes 500 -> 0. offset goes -150 -> 0.
                setOffsetY(rect.top * -0.3); 
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={sectionRef} className="h-[80vh] relative flex items-center justify-center bg-black overflow-hidden group">
            <div 
                className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover pointer-events-none"
                style={{ 
                    transform: `translateY(${offsetY}px)`,
                    willChange: 'transform'
                }}
            >
                 <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070" 
                    alt="Futuristic architectural view" 
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
           
            <div className="relative z-10 text-center max-w-4xl px-6">
                <h2 className="text-3xl md:text-6xl font-extralight tracking-tight mb-16 italic opacity-60 uppercase leading-tight">
                    Diseño que trasciende la función para convertirse en <span className="text-white opacity-100 not-italic">luz pura.</span>
                </h2>
                
                <a href="#contact-info" className="text-2xl md:text-4xl font-extralight border-b border-white/20 hover:border-white transition-colors pb-4 inline-block uppercase group">
                  SOLICITAR ASESORAMIENTO <span className="italic opacity-30 group-hover:opacity-100 transition-opacity">_TECH</span>
                </a>
            </div>
        </section>
    );
};

export default VisionSection;
