
import React from 'react';

interface FooterProps {
  onAdminOpen?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminOpen }) => {
  return (
    <footer id="contact" className="bg-[#050505] text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-futuristic text-3xl tracking-[0.3em] font-extralight mb-8">MORK</h2>
          <p className="text-neutral-500 max-w-sm font-light text-sm leading-relaxed">
            The future of interior light modulation. Designed in the digital age, crafted for physical excellence.
          </p>
        </div>
        
        <div>
          <h4 className="font-futuristic text-[10px] tracking-widest mb-6 opacity-40">SOCIALS</h4>
          <ul className="space-y-4 font-light text-sm text-neutral-400">
            <li><a href="https://www.instagram.com/morkcortinas" target="_blank" className="hover:text-white transition-colors">INSTAGRAM</a></li>
            <li><a href="#" className="hover:text-white transition-colors">BEHANCE</a></li>
            <li><a href="#" className="hover:text-white transition-colors">PINTEREST</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-futuristic text-[10px] tracking-widest mb-6 opacity-40">CONTACT</h4>
          <ul className="space-y-4 font-light text-sm text-neutral-400">
            <li>HELLO@MORK.TECH</li>
            <li>+54 9 11 1234 5678</li>
            <li>BUENOS AIRES, ARG</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-futuristic tracking-[0.3em] text-neutral-600">
        <span>© 2024 MORK TECHNOLOGIES. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8 items-center">
          <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-white transition-colors">TERMS</a>
          <button 
            onClick={onAdminOpen}
            className="hover:text-white transition-colors border border-white/10 px-4 py-1 hover:border-white/40"
          >
            ADMIN
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
