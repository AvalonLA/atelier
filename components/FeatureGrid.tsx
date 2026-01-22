import React, { useEffect, useMemo, useRef, useState } from "react";
// import { allProducts } from "../data/products"; // REMOVED: Using hook
import { Product } from "../types";
import { useProducts } from "../hooks/useProducts";
import { TableRowSkeleton } from "./ui/AdminSkeletons";
import { useConfig } from "../context/ConfigContext";
import { supabase } from "../services/supabase";

const ExpandingGridRow: React.FC<{
  products: Product[];
  onSelectProduct: (p: Product) => void;
}> = ({ products, onSelectProduct }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div 
      className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[80vh] overflow-hidden" 
      onMouseLeave={() => setExpandedIndex(null)}
    >
      {products.map((p, i) => (
        <div
          key={p.id}
          onClick={() => onSelectProduct(p)}
          onMouseEnter={() => setExpandedIndex(i)}
          className={`group relative ${expandedIndex === i ? "flex-[3]" : "flex-[1]"} transition-all duration-500 ease-in-out overflow-hidden border-r last:border-0 border-white/10 cursor-pointer`}
        >
          <img
            src={p.image}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={p.name}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white">
            <div className="pb-12">
              <p className="font-futuristic text-[10px] lg:text-xs uppercase tracking-[0.4em] font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                {p.tag}
              </p>
              <h3 className="font-futuristic text-3xl lg:text-5xl font-bold mb-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                {p.name}
              </h3>
              <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-[1000ms]">
                <p className="font-futuristic text-xl lg:text-2xl font-light italic">
                  {p.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface FeatureGridProps {
  onSelectProduct: (product: Product) => void;
  showAll?: boolean;
  onShowAll?: () => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  onSelectProduct,
  showAll = false,
  onShowAll,
}) => {
  const { products: allProducts, loading } = useProducts();
  const { config, updateLocalConfig } = useConfig();
  const [filter, setFilter] = useState<string>("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
      headline: "",
      subheadline: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsAdmin(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setIsAdmin(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
      if (!isEditing) {
        if (showAll) {
            setEditValues({
                headline: config.catalog_headline_full || "SISTEMAS ATELIER.",
                subheadline: config.catalog_description_full || "FILTROS_TÉCNICOS"
            });
        } else {
            setEditValues({
                headline: config.catalog_headline || "DISEÑO EXPANSIVO.",
                subheadline: config.catalog_description || "LA COLECCIÓN"
            });
        }
      }
  }, [isEditing, showAll, config]);

  const handleSave = async () => {
    if (showAll) {
        await updateLocalConfig({
            catalog_headline_full: editValues.headline,
            catalog_description_full: editValues.subheadline
        });
    } else {
        await updateLocalConfig({
            catalog_headline: editValues.headline,
            catalog_description: editValues.subheadline
        });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeTab = tabsRef.current.find(
        (tab) => tab?.getAttribute("data-id") === filter,
      );
      if (activeTab) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [filter, showAll]);

  const filteredProducts = useMemo(() => {
    return filter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === filter);
  }, [filter, allProducts]);

  const productChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      chunks.push(filteredProducts.slice(i, i + 2));
    }
    return chunks;
  }, [filteredProducts]);

  const displayedProducts = showAll
    ? filteredProducts
    : allProducts.slice(0, 4);

  const displayedChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < displayedProducts.length; i += 2) {
      chunks.push(displayedProducts.slice(i, i + 2));
    }
    return chunks;
  }, [displayedProducts]);

  const filters = [
    { id: "all", label: "TODOS" },
    { id: "pendant", label: "COLGANTES" },
    { id: "floor", label: "DE PIE" },
    { id: "table", label: "DE MESA" },
    { id: "tech", label: "SMART" },
  ];

  if (loading) {
      return (
          <section id="showcase" className="py-24 bg-[#050505] min-h-screen flex items-center justify-center">
              <div className="font-futuristic text-xs tracking-[0.3em] text-neutral-500 animate-pulse">
                  LOADING_COLLECTION...
              </div>
          </section>
      );
  }

  return (
    <section
      id="showcase"
      className="py-24 bg-[#050505] transition-all duration-1000 overflow-hidden relative group/showcase"
    >
       {/* Admin Controls */}
       {isAdmin && (
        <div className="absolute top-24 right-6 z-50 flex gap-2">
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover/showcase:opacity-100"
                    title="Editar Sección"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            ) : (
                <>
                    <button 
                        onClick={handleSave}
                        className="p-2 bg-green-500/80 backdrop-blur-md rounded-full text-white hover:bg-green-500 transition-all"
                        title="Guardar Cambios"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                     <button 
                        onClick={() => setIsEditing(false)}
                        className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"
                         title="Cancelar Edición"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </>
            )}
        </div>
      )}

      {showAll && (
        <div className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24">
          <img
            src="/images/pexels-photo-276528.webp"
            alt="Collection Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center space-y-4">
            <h1 className="font-futuristic text-5xl md:text-8xl tracking-tighter uppercase font-thin">
              CATÁLOGO <br />
              <span className="italic opacity-30 text-white">EXTENDIDO.</span>
            </h1>
            <p className="font-futuristic text-[10px] tracking-[0.6em] text-neutral-500">
              ENGINEERED FOR MODERN SPACES
            </p>
          </div>
        </div>
      )}

      <div className="max-w-[100vw] mx-auto px-4">
        <div className="flex flex-col mb-16 gap-8 px-6">
          <div className="max-w-2xl">
            <h3 className="font-futuristic text-[10px] tracking-[0.5em] text-neutral-500 mb-4 uppercase">
              {isEditing ? (
                  <input 
                    value={editValues.subheadline}
                    onChange={e => setEditValues({...editValues, subheadline: e.target.value})}
                    className="bg-transparent border-b border-white/20 outline-none w-full focus:border-white transition-colors"
                  />
              ) : (
                  <span>{showAll ? (config.catalog_description_full || "FILTROS_TÉCNICOS") : (config.catalog_description || "LA COLECCIÓN")}</span>
              )}
            </h3>
            <h2 className="text-4xl md:text-8xl font-extralight tracking-tighter leading-none mb-12">
              {isEditing ? (
                  <textarea 
                    value={editValues.headline}
                    onChange={e => setEditValues({...editValues, headline: e.target.value})}
                    className="bg-transparent border border-white/20 outline-none w-full h-32 p-2 focus:border-white transition-colors text-4xl"
                  />
              ) : (
                  <span dangerouslySetInnerHTML={{ __html: showAll ? (config.catalog_headline_full || "SISTEMAS <br/> <span class='opacity-40 italic'>ATELIER.</span>") : (config.catalog_headline || "DISEÑO <br/> <span class='opacity-40 italic'>EXPANSIVO.</span>") }} />
              )}
            </h2>

            {showAll && (
              <div className="flex flex-wrap gap-4 md:gap-12 relative z-[200]">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFilter(f.id);
                    }}
                    className={`relative z-[300] font-futuristic text-[11px] tracking-widest transition-all duration-300 cursor-pointer outline-none select-none px-4 py-3 bg-transparent md:bg-black/40 ${
                      filter === f.id
                        ? "text-white tracking-[0.25em] border-b border-white"
                        : "text-[#a3a3a3] hover:text-white hover:tracking-[0.25em] border-b border-transparent hover:border-white/20"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full bg-black">
          {displayedChunks.map((chunk, idx) => (
            <ExpandingGridRow
              key={idx}
              products={chunk}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        {!showAll && (
          <div className="mt-20 text-center pb-12">
            <button
              onClick={onShowAll}
              className="px-20 py-6 border border-white/10 hover:border-white transition-all duration-700 font-futuristic text-[10px] tracking-[0.5em] group overflow-hidden relative"
            >
              <span className="relative z-10">
                VER COLECCIÓN COMPLETA{" "}
                <span className="inline-block transition-transform group-hover:translate-x-4">
                  →
                </span>
              </span>
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
