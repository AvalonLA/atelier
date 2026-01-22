import React, { useEffect, useMemo, useState } from "react";
import { allProducts } from "../../data/products";
import { Product } from "../../types";
import { TableRowSkeleton } from "../ui/AdminSkeletons";
import { InventoryService } from "../../services/supabase";
import { optimizeImage } from "../../utils/imageOptimizer";
import { useConfig } from "../../context/ConfigContext";

export const AdminInventory: React.FC = () => {
  const { config } = useConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProducts();
  }, [config.use_mock_data]);

  const loadProducts = async () => {
    setIsLoading(true);
    if (!config.use_mock_data) {
        try {
            const data = await InventoryService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products from Supabase, falling back to mock:", error);
            const { allProducts } = await import("../../data/products");
            setProducts(allProducts);
        }
    } else {
         const { allProducts } = await import("../../data/products");
         setProducts(allProducts);
    }
    setIsLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const id = productToDelete;

    try {
      // Clean up images first
      const product = products.find(p => p.id === id);
      if (product?.gallery?.length) {
        await Promise.all(product.gallery.map(img => InventoryService.deleteImage(img)));
      }

      await InventoryService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  const handleSave = async (product: Product) => {
    try {
      // Cleanup removed images from storage
      if (editingProduct) {
        const oldImages = editingProduct.gallery || [];
        const newImages = product.gallery || [];
        const removedImages = oldImages.filter(img => !newImages.includes(img));
        
        if (removedImages.length > 0) {
          await Promise.all(removedImages.map(img => InventoryService.deleteImage(img)));
        }
      }

      if (product.id.startsWith("NEW_")) {
        const { id, ...data } = product;
        const saved = await InventoryService.addProduct(data);
        setProducts((prev) => [saved, ...prev]);
      } else {
        const saved = await InventoryService.updateProduct(product.id, product);
        setProducts((prev) =>
          prev.map((p) => (p.id === saved.id ? saved : p)),
        );
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Error al guardar el producto");
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-light dark:text-white text-black">
            Inventario
          </h2>
          <p className="text-xs font-futuristic tracking-[0.2em] text-neutral-500 uppercase mt-1">
            Gestión de Catálogo
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm outline-none focus:border-neutral-500 w-full md:w-64"
          />
          <div className="flex bg-neutral-100 dark:bg-neutral-900 rounded p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded transition-all ${viewMode === "table" ? "bg-white dark:bg-black shadow-sm" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-white dark:bg-black shadow-sm" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[10px] font-futuristic tracking-widest hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            + NUEVO
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] font-futuristic tracking-widest text-neutral-500 uppercase border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 hidden md:table-cell">Categoría</th>
              <th className="px-6 py-4 hidden lg:table-cell">Tag</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 dark:text-gray-300 text-gray-800">
            {isLoading ? (
              [...Array(3)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30 gap-4">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <div className="font-futuristic text-[10px] tracking-widest uppercase">
                      {searchTerm
                        ? "No se encontraron resultados"
                        : "Sin productos en inventario"}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm dark:text-white text-black">
                        {product.name}
                      </div>
                      <div className="text-xs text-neutral-500 truncate max-w-[200px]">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[9px] font-futuristic uppercase tracking-wider rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs font-mono text-neutral-500">
                        {product.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
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
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 hover:bg-red-500/10 rounded text-red-500"
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
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="group border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 transition-all hover:shadow-lg">
              <div className="aspect-square relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex gap-1 bg-white/90 dark:bg-black/90 p-1 rounded backdrop-blur-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-1 hover:text-blue-500"
                    >
                      <svg
                            className="w-3 h-3"
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
                   <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-1 hover:text-red-500"
                    >
                       <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                       </svg>
                   </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                 <div className="flex justify-between items-start">
                   <h4 className="font-medium text-sm dark:text-white text-black line-clamp-1">{product.name}</h4>
                   <span className="text-[9px] font-futuristic uppercase bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">{product.category}</span>
                 </div>
                 <p className="text-xs text-neutral-500 line-clamp-2">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      {productToDelete && (
        <ConfirmationModal
          title="ELIMINAR PRODUCTO"
          message="¿Está seguro que desea eliminar este producto? Esta acción es irreversible."
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </>
  );
};

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const { config } = useConfig();
  const [formData, setFormData] = useState<Product>(
    product
      ? {
          ...product,
          gallery: product.gallery || [],
          specs: product.specs || [],
        }
      : {
          id: `NEW_${Date.now()}`,
          name: "",
          category: "pendant",
          description: "",
          longDescription: "",
          image: "",
          gallery: [],
          tag: "",
          specs: [],
        },
  );

  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    
    // Process serially to maintain order if desired, or parallel
    for (const file of validFiles) {
      try {
        const optimized = await optimizeImage(file);
        const url = await InventoryService.uploadImage(optimized);
        setFormData((prev) => {
          const newGallery = [...prev.gallery, url];
          return {
            ...prev,
            gallery: newGallery,
            // If image is empty or not in current gallery, set to first item of new gallery
            image: (prev.image && prev.gallery.includes(prev.image)) ? prev.image : newGallery[0], 
          };
        });
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Handle File Drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
      return;
    }
  };

  const handleReorderDrop = (e: React.DragEvent, toIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check if we are reordering
    const fromIndexStr = e.dataTransfer.getData("text/plain");
    if (!fromIndexStr) return; // Might be a file drop

    const fromIndex = parseInt(fromIndexStr);
    if (isNaN(fromIndex)) return;

    if (fromIndex === toIndex) return;

    const newGallery = [...formData.gallery];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);

    setFormData((prev) => ({
      ...prev,
      gallery: newGallery,
      image: newGallery[0], // Always force first image as main
    }));
    setDraggedImageIndex(null);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white dark:bg-[#111] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 relative z-10">
        {/* Helper for dark mode text */}
        <div className="flex-1 p-8 space-y-6 dark:text-gray-200 text-gray-800">
          {config.use_mock_data &&  (
              <div className="bg-yellow-500/10 border border-yellow-500/50 p-2 text-yellow-500 text-[10px] font-futuristic tracking-widest text-center">
                  MODO MOCK DATA: Los cambios no se guardarán en la base de datos real.
              </div>
          )}
          <div className="flex justify-between items-start">
            <h3 className="font-futuristic text-xl tracking-widest uppercase dark:text-white text-black">
              {product ? "EDITAR_PRODUCTO" : "NUEVO_PRODUCTO"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
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
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 text-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Nombre
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 p-3 rounded focus:border-black dark:focus:border-white outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Product["category"],
                  })
                }
                className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 p-3 rounded focus:border-black dark:focus:border-white outline-none appearance-none"
              >
                <option value="pendant">Pendant (Suspensión)</option>
                <option value="floor">Floor (Pie)</option>
                <option value="table">Table (Mesa)</option>
                <option value="tech">Tech (Smart)</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Descripción Corta
              </label>
              <input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 p-3 rounded focus:border-black dark:focus:border-white outline-none transition-colors"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Descripción Larga
              </label>
              <textarea
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                rows={4}
                className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 p-3 rounded focus:border-black dark:focus:border-white outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Galería & Media
              </label>
              <label className="cursor-pointer text-xs font-medium hover:underline flex items-center gap-2">
                <span>+ AGREGAR IMÁGENES</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div
              className={`grid grid-cols-4 gap-4 p-4 min-h-[120px] rounded-lg border-2 border-dashed transition-colors ${isDragging ? "border-blue-500 bg-blue-50/10" : "border-neutral-200 dark:border-white/10"}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {formData.gallery.length === 0 && (
                <div className="col-span-4 flex flex-col items-center justify-center text-neutral-400 gap-2 pointer-events-none">
                  <svg
                    className="w-8 h-8 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs">Arrastra imágenes aquí</span>
                </div>
              )}
              {formData.gallery.map((img, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", idx.toString());
                    setDraggedImageIndex(idx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault(); 
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => handleReorderDrop(e, idx)}
                  className={`relative aspect-square rounded transition-all duration-300 overflow-hidden group border cursor-move ${
                    idx === 0 
                      ? "border-2 border-black dark:border-white shadow-lg ring-2 ring-offset-2 ring-transparent" 
                      : "border-neutral-200 dark:border-white/10"
                  } ${draggedImageIndex === idx ? "opacity-30 scale-95" : "opacity-100 hover:scale-[1.02]"}`}
                >
                  {idx === 0 && (
                    <span className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black text-[9px] font-futuristic tracking-widest px-2 py-1 z-10">
                      MAIN
                    </span>
                  )}
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    onClick={() =>
                      setFormData((prev) => {
                        const newGallery = prev.gallery.filter((_, i) => i !== idx);
                        return {
                            ...prev,
                            gallery: newGallery,
                            image: newGallery.length > 0 ? newGallery[0] : "",
                        };
                      })
                    }
                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
                  >
                    <svg
                      className="w-3 h-3"
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
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-400">
              * La primera imagen será usada como portada principal.
            </p>
          </div>
        </div>

        {/* Actions Footer / Sidebar on desktop */}
        <div className="p-8 bg-neutral-50 dark:bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-white/10 flex flex-col gap-4 min-w-[250px]">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50">
                Código Stock
              </label>
              <input
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 p-3 rounded"
              />
            </div>

            {/* Tech Specs Builder */}
            <div className="space-y-2">
              <label className="text-[10px] font-futuristic tracking-widest uppercase opacity-50 flex justify-between">
                <span>Specs Técnicas</span>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      specs: [...prev.specs, { label: "New", value: "" }],
                    }))
                  }
                  className="hover:text-blue-500"
                >
                  + ADD
                </button>
              </label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {formData.specs?.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={spec.label}
                      onChange={(e) => {
                        const newSpecs = [...formData.specs];
                        newSpecs[i].label = e.target.value;
                        setFormData({ ...formData, specs: newSpecs });
                      }}
                      className="w-1/3 text-xs bg-transparent border-b border-neutral-300 dark:border-neutral-700 outline-none"
                      placeholder="Label"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...formData.specs];
                        newSpecs[i].value = e.target.value;
                        setFormData({ ...formData, specs: newSpecs });
                      }}
                      className="w-2/3 text-xs bg-transparent border-b border-neutral-300 dark:border-neutral-700 outline-none"
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[10px] font-futuristic tracking-widest border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="flex-1 py-3 text-[10px] font-futuristic tracking-widest bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
            >
              GUARDAR CAMBIOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onCancel} />
            <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-md p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative z-10">
                <h3 className="font-futuristic text-lg tracking-[0.2em] mb-4 uppercase text-red-600 dark:text-red-500">
                    {title}
                </h3>
                <p className="text-sm font-light text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-4 justify-end">
                    <button 
                        onClick={onCancel}
                        className="px-6 py-3 text-[10px] font-futuristic tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-8 py-3 text-[10px] font-futuristic tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        ELIMINAR
                    </button>
                </div>
            </div>
        </div>
    );
};
