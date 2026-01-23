import React, { useEffect, useMemo, useRef, useState } from "react";
// import { allProducts } from "../data/products"; // REMOVED: Using hook
import { useCart } from "../context/CartContext";
import { useConfig } from "../context/ConfigContext";
import { useProducts } from "../hooks/useProducts";
import { supabase } from "../services/supabase";
import { Product } from "../types";

const ExpandingGridRow: React.FC<{
  products: Product[];
  onSelectProduct: (p: Product) => void;
}> = ({ products, onSelectProduct }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addItem(p);
  };

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
          className={`group relative ${expandedIndex === i ? "flex-[3]" : "flex-[1]"} min-w-0 h-full transition-all duration-500 ease-in-out overflow-hidden border-r last:border-0 border-white/10 cursor-pointer`}
        >
          <img
            src={p.image}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={p.name}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

          {/* Add to Cart Button on Hover */}
          <button
            onClick={(e) => handleAddToCart(e, p)}
            className="absolute top-8 right-8 z-20 w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
            title="Agregar al Carrito"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white pointer-events-none">
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
  const [showFilters, setShowFilters] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editValues, setEditValues] = useState({
    headline: "",
    subheadline: "",
    // Collection Hero Specific
    collectionHeadline: "",
    collectionSubheadline: "",
    collectionImage: "",
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setIsAdmin(!!session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setIsAdmin(!!session),
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setEditValues({
        // Main section defaults
        headline: showAll
          ? config.catalog_headline_full || "SISTEMAS ATELIER."
          : config.catalog_headline || "DISEÑO EXPANSIVO.",
        subheadline: showAll
          ? config.catalog_description_full || "FILTROS_TÉCNICOS"
          : config.catalog_description || "LA COLECCIÓN",

        // Collection Hero Defaults
        collectionHeadline:
          config.collection_hero_headline ||
          "CATÁLOGO <br/> <span class='italic opacity-30 text-white'>EXTENDIDO.</span>",
        collectionSubheadline:
          config.collection_hero_subheadline || "ENGINEERED FOR MODERN SPACES",
        collectionImage:
          config.collection_hero_image_url ||
          "/images/pexels-photo-276528.webp",
      });
    }
  }, [isEditing, showAll, config]);

  const handleSave = async () => {
    if (showAll) {
      await updateLocalConfig({
        catalog_headline_full: editValues.headline,
        catalog_description_full: editValues.subheadline,
        collection_hero_headline: editValues.collectionHeadline,
        collection_hero_subheadline: editValues.collectionSubheadline,
        collection_hero_image_url: editValues.collectionImage,
      });
    } else {
      await updateLocalConfig({
        catalog_headline: editValues.headline,
        catalog_description: editValues.subheadline,
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const url = await import("../services/supabase").then((m) =>
        m.InventoryService.uploadImage(e.target.files![0]),
      );
      setEditValues((prev) => ({ ...prev, collectionImage: url }));
    } catch (e) {
      console.error(e);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
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
    { id: "floor", label: "DE PIE" },
    { id: "table", label: "DE MESA" },
    { id: "tech", label: "SMART" },
    { id: "pendant", label: "COLGANTES" },
  ];

  if (loading) {
    return (
      <section
        id="showcase"
        className="py-24 bg-[#050505] min-h-screen flex items-center justify-center"
      >
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-green-500/80 backdrop-blur-md rounded-full text-white hover:bg-green-500 transition-all"
                title="Guardar Cambios"
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
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"
                title="Cancelar Edición"
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
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {showAll && (
        <div className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24 group/hero">
          {isEditing && (
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 bg-blue-500/80 backdrop-blur-md rounded text-white text-[10px] tracking-widest hover:bg-blue-500 transition-all ${isUploading ? "animate-pulse" : ""}`}
              >
                {isUploading ? "SUBIENDO..." : "CAMBIAR IMAGEN"}
              </button>
            </div>
          )}

          <img
            src={
              isEditing
                ? editValues.collectionImage
                : config.collection_hero_image_url ||
                  "/images/pexels-photo-276528.webp"
            }
            alt="Collection Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center space-y-4">
            {isEditing ? (
              <div className="flex flex-col items-center gap-4">
                <textarea
                  value={editValues.collectionHeadline}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      collectionHeadline: e.target.value,
                    })
                  }
                  className="font-futuristic text-5xl md:text-8xl tracking-tighter uppercase font-thin bg-transparent border border-white/20 text-center w-[80vw] h-48 focus:border-white focus:outline-none p-4"
                />
                <input
                  value={editValues.collectionSubheadline}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      collectionSubheadline: e.target.value,
                    })
                  }
                  className="font-futuristic text-[10px] tracking-[0.6em] text-neutral-500 bg-transparent border-b border-white/20 w-fit text-center focus:border-white focus:outline-none pb-2"
                />
              </div>
            ) : (
              <>
                <h1
                  className="font-futuristic text-5xl md:text-8xl tracking-tighter uppercase font-thin"
                  dangerouslySetInnerHTML={{
                    __html:
                      config.collection_hero_headline ||
                      "CATÁLOGO <br/> <span class='italic opacity-30 text-white'>EXTENDIDO.</span>",
                  }}
                ></h1>
                <p className="font-futuristic text-[10px] tracking-[0.6em] text-neutral-500">
                  {config.collection_hero_subheadline ||
                    "ENGINEERED FOR MODERN SPACES"}
                </p>
              </>
            )}
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
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      subheadline: e.target.value,
                    })
                  }
                  className="bg-transparent border-b border-white/20 outline-none w-full focus:border-white transition-colors"
                />
              ) : (
                <span>
                  {showAll
                    ? config.catalog_description_full || "FILTROS_TÉCNICOS"
                    : config.catalog_description || "LA COLECCIÓN"}
                </span>
              )}
            </h3>
            <h2 className="text-4xl md:text-8xl font-extralight tracking-tighter leading-none mb-12">
              {isEditing ? (
                <textarea
                  value={editValues.headline}
                  onChange={(e) =>
                    setEditValues({ ...editValues, headline: e.target.value })
                  }
                  className="bg-transparent border border-white/20 outline-none w-full h-32 p-2 focus:border-white transition-colors text-4xl"
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: showAll
                      ? config.catalog_headline_full ||
                        "SISTEMAS <br/> <span class='opacity-40 italic'>ATELIER.</span>"
                      : config.catalog_headline ||
                        "DISEÑO <br/> <span class='opacity-40 italic'>EXPANSIVO.</span>",
                  }}
                />
              )}
            </h2>

            {showAll && (
              <div className="flex flex-col gap-8 relative z-[200]">
                <div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-futuristic text-xs tracking-[0.2em] border-b border-white/30 text-white/50 hover:text-white hover:border-white transition-all pb-1 uppercase"
                  >
                    {showFilters ? "- OCULTAR FILTROS" : "+ MOSTRAR FILTROS"}
                  </button>
                </div>

                {showFilters && (
                  <div className="animate-in slide-in-from-left-4 fade-in duration-500">
                    <div className="flex flex-wrap gap-4 md:gap-12 mb-8">
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

                    <div>
                      <button className="font-futuristic text-[10px] tracking-[0.2em] bg-white/5 px-6 py-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors uppercase">
                        FILTROS AVANZADOS +
                      </button>
                    </div>
                  </div>
                )}
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
