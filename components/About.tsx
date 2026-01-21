
import React from 'react';

const historyItems = [
  {
    year: '2018',
    title: 'LA GÉNESIS',
    description: 'Nacimiento de ATELIER en un pequeño estudio de diseño en La Plata, con la visión de reinventar la iluminación espacial.',
    image: '/images/pexels-photo-3183150.webp'
  },
  {
    year: '2020',
    title: 'REVOLUCIÓN SMART',
    description: 'Lanzamiento de nuestro sistema de iluminación adaptativa con integración neural.',
    image: '/images/pexels-photo-3861969.webp'
  },
  {
    year: '2022',
    title: 'VISIÓN GLOBAL',
    description: 'Expansión a proyectos arquitectónicos internacionales, iluminando residencias y espacios corporativos de vanguardia.',
    image: '/images/pexels-photo-256150.webp'
  },
  {
    year: '2024',
    title: 'INTEGRACIÓN IA',
    description: 'Integración total de Gemini AI para simulación de ambientes y asesoramiento lumínico en tiempo real.',
    image: '/images/pexels-photo-8386440.webp'
  }
];

const About: React.FC = () => {
  return (
    <div id="about" className="bg-black pt-32 pb-24 text-white">
      {/* Hero Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-500 mb-8 uppercase">Nuestra Historia</h2>
          <h1 className="text-5xl md:text-[8rem] font-thin tracking-tighter leading-none mb-12">
            LEGADO <span className="italic opacity-30">VIRTUAL.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-neutral-400 font-light text-lg leading-relaxed">
            ATELIER no es solo una marca de iluminación; es un laboratorio de ingeniería lumínica donde el futuro de la arquitectura se encuentra con la precisión técnica.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden lg:block"></div>
        
        <div className="max-w-7xl mx-auto space-y-32">
          {historyItems.map((item, index) => (
            <div key={item.year} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full">
                <div className="aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left space-y-6">
                <span className="font-futuristic text-4xl text-white/20">{item.year}</span>
                <h3 className="font-futuristic text-2xl tracking-widest">{item.title}</h3>
                <p className="text-neutral-500 font-light leading-relaxed text-lg">
                  {item.description}
                </p>
                <div className="w-12 h-[1px] bg-white/20 mx-auto lg:mx-0"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
