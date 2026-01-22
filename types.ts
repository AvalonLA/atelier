export interface Product {
  id: string;
  name: string;
  category: "pendant" | "floor" | "table" | "tech";
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  tag: string;
  specs: { label: string; value: string }[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface Consultation {
  id: string;
  customerName: string;
  productName: string;
  query: string;
  created_at?: string;
  status: "pending" | "responded";
}

export interface Order {
  id: string;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  status: "pending" | "processed" | "shipped" | "delivered" | "cancelled";
  items?:  {
    product: Product;
    quantity: number;
    price: number;
    note?: string;
  }[];
}

export interface AppConfig {
  id?: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  opening_hours: string;
  ai_active: boolean; 
  use_mock_data: boolean;
  hero_headline?: string;
  hero_subheadline?: string;
  hero_text?: string;
  hero_image_url?: string;
}

export enum NavigationSection {
  Hero = "hero",
  Showcase = "showcase",
  AI = "ai",
  Contact = "contact",
}
