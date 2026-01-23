import React, { useEffect, useMemo, useRef, useState } from "react";
import { GeminiService } from "../services/geminiService";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useConfig } from "../context/ConfigContext";

interface ProductViewProps {
  product: Product;
  onClose: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({ product, onClose }) => {
  const { addItem, setIsOpen } = useCart();
  const { config } = useConfig();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clarification, setClarification] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("day");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      // Check if click is inside the floating assistant
      const floatingAssistant = document.getElementById(
        "floating-assistant-container",
      );
      const isClickInAssistant =
        floatingAssistant && floatingAssistant.contains(target);

      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !isClickInAssistant
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const allImages = useMemo(
    () => [product.image, ...product.gallery],
    [product],
  );

  // Handle keys for fullscreen modal (ESC + Arrows)
  useEffect(() => {
    if (!fullscreenImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenImage(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = allImages.indexOf(fullscreenImage);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % allImages.length;
          setFullscreenImage(allImages[nextIndex]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = allImages.indexOf(fullscreenImage);
        if (currentIndex !== -1) {
          const prevIndex =
            (currentIndex - 1 + allImages.length) % allImages.length;
          setFullscreenImage(allImages[prevIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage, allImages]);

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
      const themeText =
        selectedTheme === "day"
          ? "during daytime"
          : selectedTheme === "night"
            ? "at night"
            : "at sunset";
      const fullPrompt = clarification
        ? `${clarification}. ${themeText}`
        : themeText;

      // Convert product image to base64
      let productBase64 = null;
      try {
          const response = await fetch(product.image);
          const blob = await response.blob();
          productBase64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
          });
      } catch (e) {
          console.error("Failed to load product image for AI", e);
      }

      if (productBase64) {
        const result = await GeminiService.visualizeLighting(
            userImage,
            productBase64,
            product.name,
            fullPrompt,
        );
        setResultImage(result);
      } else {
        alert("Error loading product image data.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar la imagen. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `atelier-visualization-${product.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={modalRef}
      data-lenis-prevent
      className="fixed inset-0 z-[50000] bg-black overflow-y-auto animate-in fade-in duration-700"
    >
      <div className="fixed top-0 left-0 w-full h-24 bg-black z-[-1]" />
      {/* Fullscreen Image Modal */}

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out animate-in fade-in zoom-in-95 duration-300"
          onClick={() => setFullscreenImage(null)}
        >
          <button className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform duration-300">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
        <button
          onClick={onClose}
          className="font-futuristic text-[10px] tracking-[0.3em] flex items-center gap-4 hover:opacity-50 transition-opacity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          VOLVER A COLECCIÓN
        </button>
        <span className="font-futuristic text-[10px] tracking-[0.5em] hidden md:block">
          TECH_SPECS // {product.id}
        </span>
      </nav>

      <section className="relative h-[90vh] flex items-end p-8 md:p-20 overflow-hidden group/hero">
        <img
          key={galleryIndex}
          src={allImages[galleryIndex]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover scale-105 cursor-zoom-in animate-in fade-in duration-500"
          onClick={() => setFullscreenImage(allImages[galleryIndex])}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        {/* Navigation Arrows & Counter */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-8 md:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setGalleryIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
              }}
              className="pointer-events-auto p-4 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover/hero:opacity-100"
              title="Anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setGalleryIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
              }}
              className="pointer-events-auto p-4 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover/hero:opacity-100"
              title="Siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300">
           {allImages.length > 1 && (
             <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="font-futuristic text-[10px] tracking-[0.3em] text-white">
                  {galleryIndex + 1}/{allImages.length}
                </span>
             </div>
           )}
        </div>

        <div className="relative z-10 w-full">
          <h1 className="font-futuristic text-5xl md:text-[10rem] leading-[0.85] tracking-tighter mb-8 font-extralight uppercase pointer-events-none">
            {product.name.split(" ").map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "italic opacity-50" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className="bg-white text-black py-32 px-8 md:px-20">
        <div className="max-w-5xl mx-auto flex flex-col gap-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-16">
              <div>
                <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-400 mb-8 uppercase">
                  ESPECIFICACIONES
                </h3>
                <p className="text-2xl md:text-3xl font-light leading-snug mb-12">
                  {product.longDescription}
                </p>
                <div className="grid grid-cols-2 gap-12">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="border-t border-black/10 pt-6">
                      <span className="font-futuristic text-[9px] tracking-widest text-neutral-400 block mb-2">
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:sticky md:top-32 h-fit space-y-8 bg-neutral-50 p-8 rounded-lg animate-in slide-in-from-right-4 duration-1000">
              <div className="space-y-2">
                <span className="font-futuristic text-[10px] tracking-[0.3em] uppercase opacity-50">
                  {product.category} COLLECTION
                </span>
                <h2 className="font-futuristic text-4xl uppercase font-light tracking-wide">
                  {product.name}
                </h2>
                <div className="text-3xl font-light">
                  ${product.category === "tech" ? "999" : "399"}
                </div>
              </div>
              
              <button
                onClick={() => {
                  addItem(product);
                  setIsOpen(true);
                  onClose();
                }}
                className="w-full bg-black text-white py-6 font-futuristic text-[11px] tracking-[0.4em] hover:bg-neutral-800 transition-colors"
              >
                AGREGAR AL CARRITO
              </button>

              <div className="text-[10px] text-neutral-400 font-light space-y-2 pt-4 border-t border-black/5">
                <p>— ENVÍO INTERNACIONAL DISPONIBLE</p>
                <p>— GARANTÍA DE 5 AÑOS</p>
                <p>— INSTALACIÓN PROFESSIONAL RECOMENDADA</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
              {product.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-video bg-neutral-100 overflow-hidden group border border-black/5 cursor-zoom-in"
                  onClick={() => setFullscreenImage(img)}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  />
                </div>
              ))}
            </div>

          {/* AI Room Visualizer Section */}
          <div className="border-t border-black/10 pt-24">
            <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-400 mb-12 uppercase text-center">
              AI ROOM VISUALIZER
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Controls Column */}
              <div className="space-y-8">
                { !config.ai_active ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-neutral-300 dark:border-white/10 p-12 text-center text-neutral-400">
                        <div className="space-y-4">
                             <svg className="w-8 h-8 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                             </svg>
                             <p className="text-xs font-futuristic tracking-widest">
                                 AI_MODULE_DISABLED
                             </p>
                        </div>
                    </div>
                ) : (
                <>
                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-neutral-50 border border-dashed border-black/20 hover:border-black transition-colors cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden"
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <svg
                        className="w-8 h-8 mx-auto opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="font-futuristic text-[9px] tracking-widest text-neutral-400 block">
                        SUBIR_FOTO_ESPACIO
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Render Controls - Only if image uploaded */}
                {userImage && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-4">
                      <label className="font-futuristic text-[8px] tracking-[0.3em] text-neutral-400 uppercase block">
                        1. VISIÓN_ALGORÍTMICA
                      </label>
                      <textarea
                        value={clarification}
                        onChange={(e) => setClarification(e.target.value)}
                        placeholder="Describe el ambiente (ej: 'Minimalista, mucha luz, paredes blancas')..."
                        className="w-full bg-neutral-50 border border-black/10 p-4 text-sm font-light focus:border-black focus:outline-none transition-colors min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="font-futuristic text-[8px] tracking-[0.3em] text-neutral-400 uppercase block">
                        2. ESCENA_LUMÍNICA
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Buttons with specific hover colors */}
                        {[
                          {
                            id: "day",
                            label: "DÍA",
                            color: "bg-sky-300",
                            text: "text-black",
                          },
                          {
                            id: "sunset",
                            label: "ATARDECER",
                            color: "bg-orange-400",
                            text: "text-white",
                          },
                          {
                            id: "night",
                            label: "NOCHE",
                            color: "bg-black",
                            text: "text-white",
                          },
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={`relative py-4 border border-black/10 overflow-hidden group transition-all duration-300 ${selectedTheme === theme.id ? "border-transparent" : "bg-white"}`}
                          >
                            <div
                              className={`absolute inset-0 transition-transform duration-500 ease-out ${selectedTheme === theme.id ? `translate-y-0 ${theme.color}` : `translate-y-full group-hover:translate-y-0 ${theme.color}`}`}
                            />
                            <span
                              className={`relative z-10 font-futuristic text-[9px] tracking-widest transition-colors duration-300 ${selectedTheme === theme.id ? theme.text : "text-neutral-500 group-hover:" + theme.text}`}
                            >
                              {theme.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVisualize}
                      disabled={isGenerating}
                      className="w-full bg-black text-white py-6 font-futuristic text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      {isGenerating
                        ? "PROCESANDO_SIMULACIÓN..."
                        : "3. RENDERIZAR_ESPACIO"}
                    </button>
                  </div>
                )}
                </>
                )}
              </div>

              {/* Result Column */}
              <div className="aspect-square bg-neutral-100 relative overflow-hidden border border-black/5">
                {resultImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={resultImage}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setFullscreenImage(resultImage)}
                    />
                    <button
                      onClick={handleDownload}
                      className="absolute bottom-6 right-6 bg-white text-black p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-futuristic text-[9px] tracking-widest text-neutral-300 uppercase rotate-90 md:rotate-0">
                      VISTA_PREVIA_RENDER
                    </span>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 md:px-20 text-center">
        <h2 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-600 mb-8">
          ¿INTERESADO EN {product.name}?
        </h2>
        <a
          href="#contact-info"
          onClick={onClose}
          className="text-3xl md:text-5xl font-extralight border-b border-white/20 hover:border-white transition-colors pb-4 inline-block uppercase"
        >
          SOLICITAR COTIZACIÓN <span className="italic opacity-30">_TECH</span>
        </a>
      </section>
    </div>
  );
};

export default ProductView;
