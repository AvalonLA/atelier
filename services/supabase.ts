import { createClient } from "@supabase/supabase-js";
import { Product, AppConfig } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && 
         supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';
};

if (!isSupabaseConfigured()) {
  console.warn("Missing Supabase environment variables. Backend features will be disabled.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder"
);

export const InventoryService = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: Omit<Product, "id">) {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
  },

  async uploadImage(file: File) {
    const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);
      
    return publicUrl;
  },

  async deleteImage(url: string) {
    const path = url.split('/products/').pop();
    if (!path) return;

    const { error } = await supabase.storage
      .from("products")
      .remove([path]);

    if (error) console.error("Error deleting image:", error);
  }
};

export const ConsultationService = {
  async getConsultations() {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  async addConsultation(consultation: any) {
    const { data, error } = await supabase
      .from("consultations")
      .insert([consultation])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("consultations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

   async deleteConsultation(id: string) {
    const { error } = await supabase
      .from("consultations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};

export const OrderService = {
  async getOrders() {
    // We also select sale_items and related product data if needed. 
    // Supabase JS allows nested select if valid relations exist.
    // For now we just get orders. Fetching items might require a separate query or join.
    // Assuming simple structure for now.
    const { data, error } = await supabase
      .from("orders")
      .select("*, sale_items(quantity, price, product_id, products(name, image, category))")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Transform to match frontend types if needed
    return data.map((order: any) => ({
      ...order,
      items: order.sale_items?.map((item: any) => ({
        quantity: item.quantity,
        price: item.price,
        product: item.products
      }))
    }));
  },

  async addOrder(order: any, items: any[]) {
    // 1. Create Order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Sale Items
    const saleItems = items.map(item => {
      // Validate if item.id is a UUID. If not, send null.
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
      
      return {
        order_id: orderData.id,
        product_id: isUuid ? item.id : null, 
        quantity: item.quantity,
        price: item.price || (item.category === "tech" ? 999 : 399)
      };
    });

    const { error: itemsError } = await supabase
      .from("sale_items")
      .insert(saleItems);

    if (itemsError) throw itemsError;

    return orderData;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  },

  async deleteOrder(id: string) {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};

export const ConfigService = {
  async getConfig() {
    // Try to get the first row
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If table doesn't exist or empty, return default
      console.warn("Error fetching config, returning default:", error);
      return null;
    }
    return data as AppConfig;
  },

  async updateConfig(updates: Partial<AppConfig>) {
    // Check if we have a config row first
    const existing = await this.getConfig();
    
    if (existing && existing.id) {
       const { data, error } = await supabase
        .from("config")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();
        
       if (error) throw error;
       return data as AppConfig;
    } else {
       // Create new if doesn't exist
       const { data, error } = await supabase
        .from("config")
        .insert([updates]) // id will be auto generated
        .select()
        .single();
        
       if (error) throw error;
       return data as AppConfig;
    }
  }
};
