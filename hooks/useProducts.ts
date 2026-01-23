import { useEffect, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { allProducts } from "../data/products"; // Mock
import { InventoryService } from "../services/supabase";
import { Product } from "../types";

export const useProducts = () => {
  const { config, isLoading: configLoading } = useConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    if (configLoading) return; // Wait for config

    if (config.use_mock_data) {
      // Use Mock Data
      console.log("Using Mock Data");
      setProducts(allProducts);
      setLoading(false);
    } else {
      // Use Supabase Data
      console.log("Using Supabase Data");
      try {
        const data = await InventoryService.getProducts();
        // Filter out hidden products for the public view
        const visibleProducts = data.filter((p) => p.visible !== false);
        setProducts(visibleProducts);
      } catch (error) {
        console.error(
          "Failed to fetch Supabase products, falling back to mock:",
          error,
        );
        setProducts(allProducts.filter((p) => p.visible !== false));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [config.use_mock_data, configLoading]);

  return { products, loading, refetch: fetchProducts };
};
