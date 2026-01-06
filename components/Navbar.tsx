
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'collection' | 'about' | 'contact') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', action: () => onNavigate('home') },
    { name: 'COLLECTION', action: () => onNavigate('collection') },
    { name: 'ABOUT', action: () => onNavigate('about') },
    { name: 'CONTACT', action: () => onNavigate('contact') },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-700 ${scrolled ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-[10000]">
        <button 
          onClick={() => onNavigate('home')} 
          className="font-futuristic text-2xl tracking-[0.3em] font-extralight group relative cursor-pointer"
        >
          M<span className="group-hover:text-neutral-500 transition-colors duration-300">O</span>RK
        </button>
        
        <div className="hidden md:flex space-x-12 items-center">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={link.action}
              className="font-futuristic text-[11px] tracking-widest text-[#a3a3a3] hover:text-white transition-all duration-300 hover:tracking-[0.25em] cursor-pointer outline-none select-none"
            >
              {link.name}
            </button>
          ))}
        </div>

        <button className="md:hidden text-white relative z-[110]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
