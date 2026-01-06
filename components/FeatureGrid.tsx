
import React, { useState } from 'react';
import { Product } from '../types';

export const allProducts: Product[] = [
  {
    id: '1',
    name: 'ROLLER BLACKOUT PRO',
    category: 'blackout',
    description: 'Privacidad total y oscuridad absoluta con un acabado arquitectónico.',
    longDescription: 'Nuestras cortinas Roller Blackout Pro eliminan el 100% de la luz entrante gracias a su compuesto vinílico de alta densidad. Ideales para dormitorios y salas de proyección.',
    image: '/images/pexels-photo-763147.webp',
    gallery: [
      '/images/pexels-photo-15135192.webp',
      '/images/pexels-photo-1571460.webp',
      '/images/pexels-photo-271816.webp'
    ],
    tag: 'MAX_DARKNESS',
    specs: [{ label: 'OPACIDAD', value: '100% BLACKOUT' }, { label: 'MOTORIZACIÓN', value: 'SILENT GEN' }]
  },
  {
    id: '2',
    name: 'SUNSCREEN ARCHITECTURAL',
    category: 'sunscreen',
    description: 'Modula la luz solar sin perder la conexión visual con el exterior.',
    longDescription: 'Filtra rayos UV mientras permite la entrada de luz difusa. Mantiene la visibilidad hacia afuera protegiendo la privacidad interior.',
    image: '/images/pexels-photo-279640.webp',
    gallery: [
      '/images/pexels-photo-279640.webp',
      '/images/pexels-photo-271624.webp',
      '/images/pexels-photo-271618.webp'
    ],
    tag: 'SOLAR_CONTROL',
    specs: [{ label: 'PROTECCIÓN UV', value: '97%' }, { label: 'FACTOR', value: '5%' }]
  },
  {
    id: '3',
    name: 'ZEBRA DUAL TECH',
    category: 'zebra',
    description: 'Versatilidad total con bandas alternadas de luz y sombra.',
    longDescription: 'Control dinámico mediante bandas horizontales superpuestas. La solución más versátil para livings modernos.',
    image: '/images/pexels-photo-29012618.webp',
    gallery: [
      '/images/pexels-photo-29012618.webp',
      '/images/pexels-photo-1643383.webp',
      '/images/pexels-photo-1643384.webp'
    ],
    tag: 'VERSATILE',
    specs: [{ label: 'AJUSTE', value: 'DINÁMICO' }, { label: 'SISTEMA', value: 'DOUBLE' }]
  },
  {
    id: '4',
    name: 'ULTRA MOTORIZED',
    category: 'motorized',
    description: 'Automatización total para ventanales de gran formato.',
    longDescription: 'Sistemas inteligentes integrables con Alexa y Google Home para control remoto absoluto.',
    image: '/images/pexels-photo-6775268.webp',
    gallery: [
      '/images/pexels-photo-6775268.webp',
      '/images/pexels-photo-1571468.webp'
    ],
    tag: 'SMART_HOME',
    specs: [{ label: 'INTEGRACIÓN', value: 'TOTAL' }, { label: 'MOTOR', value: 'DC 24V' }]
  },
  {
    id: '5',
    name: 'PREMIUM MESH',
    category: 'sunscreen',
    description: 'Malla técnica de alto rendimiento térmico.',
    longDescription: 'Reduce la carga calórica hasta un 40% sin perder transparencia.',
    image: '/images/pexels-photo-6045028.webp',
    gallery: [
      '/images/pexels-photo-6045028.webp',
      '/images/pexels-photo-439227.webp'
    ],
    tag: 'THERMAL_SHIELD',
    specs: [{ label: 'EFICIENCIA', value: 'A+' }, { label: 'DURABILIDAD', value: '15 AÑOS' }]
  },
  {
    id: '6',
    name: 'TOTAL DARKNESS X',
    category: 'blackout',
    description: 'Diseño industrial para oclusión total.',
    longDescription: 'Sistema de guías laterales que impide cualquier entrada lateral de luz.',
    image: '/images/pexels-photo-6969824.webp',
    gallery: [
      '/images/pexels-photo-6969824.webp',
      '/images/pexels-photo-29012618.webp'
    ],
    tag: 'TOTAL_DARK',
    specs: [{ label: 'SELLADO', value: 'HERMÉTICO' }, { label: 'ESTILO', value: 'MODERNO' }]
  }
];

interface FeatureGridProps {
  onSelectProduct: (product: Product) => void;
  showAll?: boolean;
  onShowAll?: () => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectProduct, showAll = false, onShowAll }) => {
  const [filter, setFilter] = useState<string>('all');
  
  const displayedProducts = showAll 
    ? allProducts.filter(p => filter === 'all' || p.category === filter)
    : allProducts.slice(0, 3);

  const filters = [
    { id: 'all', label: 'TODOS' },
    { id: 'blackout', label: 'BLACKOUT' },
    { id: 'sunscreen', label: 'SUNSCREEN' },
    { id: 'motorized', label: 'MOTORIZED' }
  ];

  return (
    <section id="showcase" className="py-24 bg-[#050505] transition-all duration-1000 overflow-hidden">
      {showAll && (
        <div className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24">
          <img 
            src="/images/pexels-photo-276528.webp" 
            alt="Collection Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center space-y-4">
            <h1 className="font-futuristic text-5xl md:text-8xl tracking-tighter uppercase font-thin">CATÁLOGO <br /><span className="italic opacity-30 text-white">EXTENDIDO.</span></h1>
            <p className="font-futuristic text-[10px] tracking-[0.6em] text-neutral-500">ENGINEERED FOR MODERN SPACES</p>
          </div>
        </div>
      )}

      <div className="max-w-[100vw] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-6">
          <div className="max-w-2xl">
            <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-500 mb-4 uppercase">
              {showAll ? 'FILTROS_TÉCNICOS' : 'LA COLECCIÓN'}
            </h3>
            <h2 className="text-4xl md:text-8xl font-extralight tracking-tighter leading-none">
              {showAll ? 'SISTEMAS' : 'DISEÑO'} <br /> <span className="opacity-40 italic">{showAll ? 'MORK.' : 'EXPANSIVO.'}</span>
            </h2>
          </div>
          
          {showAll && (
            <div className="flex flex-wrap gap-8 mb-4">
              {filters.map(f => (
                <button 
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`font-futuristic text-[9px] tracking-[0.3em] pb-2 border-b transition-all duration-500 ${filter === f.id ? 'border-white text-white' : 'border-transparent text-neutral-600 hover:text-neutral-300'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {displayedProducts.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onSelectProduct(p)}
              className="group relative h-[85vh] cursor-pointer overflow-hidden border border-white/5"
            >
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s] ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-10 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <span className="font-futuristic text-[9px] tracking-[0.5em] text-neutral-400 mb-2 block uppercase">{p.tag}</span>
                <h4 className="font-futuristic text-3xl tracking-widest text-white mb-4">{p.name}</h4>
                <div className="h-[1px] w-0 group-hover:w-full bg-white/30 transition-all duration-1000 mb-6"></div>
                <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {p.description}
                </p>
              </div>
              
              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && (
          <div className="mt-20 text-center pb-12">
            <button 
              onClick={onShowAll}
              className="px-20 py-6 border border-white/10 hover:border-white transition-all duration-700 font-futuristic text-[10px] tracking-[0.5em] group overflow-hidden relative"
            >
              <span className="relative z-10">VER COLECCIÓN COMPLETA <span className="inline-block transition-transform group-hover:translate-x-4">→</span></span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-0"></div>
              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 font-futuristic text-[10px] tracking-[0.5em]">
                 VER_TODO
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureGrid;
