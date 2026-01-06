
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero.jpg" 
          alt="MORK Modern Roller Curtains" 
          className="w-full h-full object-cover opacity-50 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h2 className="font-futuristic text-[10px] tracking-[0.6em] text-neutral-500 mb-10 animate-pulse uppercase">
          Architecture of Light
        </h2>
        <h1 className="font-futuristic text-6xl md:text-[10rem] font-thin tracking-tighter leading-[0.85] mb-12">
          M<span className="opacity-40 italic">O</span>RK <br /> 
          <span className="text-4xl md:text-6xl tracking-[0.2em] font-light">ROLLER_TECH</span>
        </h1>
        <p className="max-w-xl mx-auto text-neutral-400 font-light text-sm md:text-base tracking-[0.15em] leading-relaxed mb-16 uppercase">
          La interfaz definitiva entre la luz natural y el confort interior con sistemas roller de alta precisión.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <a href="#showcase" className="group relative overflow-hidden px-12 py-5 border border-white/20 font-futuristic text-[9px] tracking-[0.4em] bg-white/5">
            <span className="relative z-10">EXPLORAR_COLECCIÓN</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 font-futuristic text-[9px] tracking-[0.4em]">COLECCIÓN_ROLLER</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 flex flex-col gap-4">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent opacity-30"></div>
        <span className="font-futuristic text-[8px] tracking-[0.5em] vertical-text opacity-40">SCROLL_DOWN</span>
      </div>
      
      <style>{`.vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }`}</style>
    </section>
  );
};

export default Hero;
