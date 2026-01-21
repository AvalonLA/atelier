import React from "react";

interface FooterProps {
  onAdminOpen?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminOpen }) => {
  return (
    <footer
      id="contact"
      className="bg-[#050505] text-white py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-futuristic text-3xl tracking-[0.3em] font-extralight mb-8">
            ATELIER
          </h2>
          <p className="text-neutral-500 max-w-sm font-light text-sm leading-relaxed">
            El futuro de la modulación lumínica. Diseñado en la era digital,
            creado para la excelencia física.
          </p>
        </div>

        <div>
          <h4 className="font-futuristic text-[10px] tracking-widest mb-6 opacity-40">
            SOCIALES
          </h4>
          <ul className="space-y-4 font-light text-sm text-neutral-400">
            <li>
              <a
                href="https://www.instagram.com/atelieriluminacion"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                INSTAGRAM
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                BEHANCE
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                PINTEREST
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-futuristic text-[10px] tracking-widest mb-6 opacity-40">
            CONTACTO
          </h4>
          <ul className="space-y-4 font-light text-sm text-neutral-400">
            <li>HOLA@ATELIER.TECH</li>
            <li>+54 9 11 1234 5678</li>
            <li>BUENOS AIRES, ARG</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-futuristic tracking-[0.3em] text-neutral-600">
        <span>© 2024 ATELIER TECHNOLOGIES. TODOS LOS DERECHOS RESERVADOS.</span>
        <div className="flex gap-8 items-center">
          <a href="#" className="hover:text-white transition-colors">
            PRIVACIDAD
          </a>
          <a href="#" className="hover:text-white transition-colors">
            TÉRMINOS
          </a>
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
