
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { visualizeCurtains } from '../services/geminiService';

interface ProductViewProps {
  product: Product;
  onClose: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({ product, onClose }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clarification, setClarification] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  // Handle ESC key for fullscreen modal
  useEffect(() => {
    if (!fullscreenImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenImage(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisualize = async () => {
    if (!userImage) return;
    setIsGenerating(true);
    try {
      const result = await visualizeCurtains(userImage, product.name, clarification);
      setResultImage(result);
    } catch (error) {
      alert("Error al procesar la imagen. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `mork-visualization-${product.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={modalRef} data-lenis-prevent className="fixed inset-0 z-[110] bg-black overflow-y-auto animate-in fade-in duration-700">
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-in fade-in zoom-in-95 duration-300"
          onClick={() => setFullscreenImage(null)}
        >
          <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform duration-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img 
            src={fullscreenImage} 
            className="max-w-full max-h-full object-contain shadow-2xl" 
            alt="Fullscreen view" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-[120] mix-blend-difference text-white">
        <button onClick={onClose} className="font-futuristic text-[10px] tracking-[0.3em] flex items-center gap-4 hover:opacity-50 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
          VOLVER A COLECCIÓN
        </button>
        <span className="font-futuristic text-[10px] tracking-[0.5em] hidden md:block">TECH_SPECS // {product.id}</span>
      </nav>

      <section className="relative h-[90vh] flex items-end p-8 md:p-20 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover scale-105 cursor-zoom-in"
          onClick={() => setFullscreenImage(product.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="relative z-10 w-full">
          <h1 className="font-futuristic text-5xl md:text-[10rem] leading-[0.85] tracking-tighter mb-8 font-extralight uppercase pointer-events-none">
            {product.name.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? 'italic opacity-50' : ''}>{word} </span>
            ))}
          </h1>
        </div>
      </section>

      <section className="bg-white text-black py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-16">
            <div>
              <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-400 mb-8 uppercase">ESPECIFICACIONES</h3>
              <p className="text-2xl md:text-4xl font-light leading-snug mb-12">
                {product.longDescription}
              </p>
              <div className="grid grid-cols-2 gap-12">
                {product.specs.map((spec, i) => (
                  <div key={i} className="border-t border-black/10 pt-6">
                    <span className="font-futuristic text-[9px] tracking-widest text-neutral-400 block mb-2">{spec.label}</span>
                    <span className="text-lg font-light">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {product.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-video bg-neutral-100 overflow-hidden group border border-black/5 cursor-zoom-in"
                  onClick={() => setFullscreenImage(img)}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12 bg-neutral-50 p-12 border border-black/5 self-start sticky top-24">
            <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-400 mb-4 uppercase">AI ROOM VISUALIZER</h3>
            <p className="text-sm font-light text-neutral-500 mb-8">Sube una foto de tu espacio y añade un prompt para que nuestra IA renderice las cortinas {product.name} en tu ambiente.</p>
            
            <div className="relative aspect-video bg-neutral-200 overflow-hidden flex items-center justify-center group">
              {(resultImage || userImage) ? (
                <div className="relative w-full h-full">
                  <img 
                    src={resultImage || userImage || ''} 
                    className="w-full h-full object-cover cursor-zoom-in" 
                    alt="Visualization" 
                    onClick={() => setFullscreenImage(resultImage || userImage)}
                  />
                  {resultImage && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                      className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-full hover:bg-black transition-all group/dl shadow-lg border border-white/10"
                      title="Descargar vista previa"
                    >
                      <svg className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                  )}
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                  <span className="font-futuristic text-[9px] tracking-widest">SUBIR_FOTO_ESPACIO</span>
                </button>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
                    <span className="font-futuristic text-[10px] tracking-[0.4em] text-white">GENERANDO_AMBIENTE_VIRTUAL...</span>
                  </div>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {userImage && !resultImage && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="font-futuristic text-[8px] tracking-[0.3em] text-neutral-400 uppercase">PROMPT_DE_CONTEXTO</label>
                  <textarea 
                    value={clarification}
                    onChange={(e) => setClarification(e.target.value)}
                    placeholder="Ej: 'Habitación minimalista con mucha luz', 'Quiero que las cortinas se vean medio abiertas', 'Color grafito'..."
                    className="w-full bg-white border border-black/10 p-4 outline-none focus:border-black transition-colors text-sm font-light min-h-[100px] resize-none"
                  />
                </div>
                <button 
                  onClick={handleVisualize}
                  disabled={isGenerating}
                  className="w-full py-5 bg-black text-white font-futuristic text-[10px] tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 group"
                >
                  <span className="group-hover:tracking-[0.5em] transition-all">GENERAR_VISUALIZACIÓN_IA</span>
                </button>
                <button onClick={() => {setUserImage(null); setClarification('');}} className="w-full text-center text-[9px] font-futuristic tracking-widest opacity-40 hover:opacity-100 py-2 transition-opacity">REINICIAR_PROCESO</button>
              </div>
            )}
            
            {resultImage && (
              <div className="flex gap-4 animate-in fade-in">
                <button onClick={() => setResultImage(null)} className="flex-1 py-4 border border-black/10 font-futuristic text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all">MODIFICAR_PROMPT</button>
                <button onClick={handleDownload} className="flex-1 py-4 bg-black text-white font-futuristic text-[10px] tracking-[0.3em] hover:bg-neutral-800 transition-all">DESCARGAR</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-32 px-8 md:px-20 text-center">
        <h2 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-600 mb-8">¿INTERESADO EN {product.name}?</h2>
        <a href="#contact-info" onClick={onClose} className="text-3xl md:text-5xl font-extralight border-b border-white/20 hover:border-white transition-colors pb-4 inline-block uppercase">
          SOLICITAR COTIZACIÓN <span className="italic opacity-30">_TECH</span>
        </a>
      </section>
    </div>
  );
};

export default ProductView;
