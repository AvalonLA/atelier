import React from "react";
import { useConfig } from "../context/ConfigContext";

const ContactInfo: React.FC = () => {
  const { config } = useConfig();
  return (
    <section id="contact-info" className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-500 mb-4 uppercase">
                UBICACIÓN_FLAGSHIP
              </h3>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tighter">
                ESTAMOS EN <br />
                <span className="opacity-40 italic">EL CENTRO.</span>
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-futuristic text-[9px] tracking-widest text-neutral-500 mb-2 uppercase">
                    UBICACIÓN
                  </h4>
                  <p className="text-xl font-light">
                    Calle 12 y 50 N° 820, La Plata
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-futuristic text-[9px] tracking-widest text-neutral-500 mb-2 uppercase">
                    HORARIOS
                  </h4>
                  <p className="text-sm font-light text-neutral-400">
                    {config.opening_hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-video bg-neutral-900 overflow-hidden group border border-white/5">
            {/* Google Maps Embed - Free & Interactive */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.748364808383!2d-57.954620023473175!3d-34.91277127464003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e633d7b3e64f%3A0xc6a8276f57c6b44c!2sC.%2017%20903%2C%20B1900%20La%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
              className="w-full h-full border-0 grayscale invert opacity-70 contrast-125 hover:opacity-90 transition-opacity"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border border-white/10 group-hover:border-white/20 transition-colors"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
