
export interface Product {
  id: string;
  name: string;
  category: 'pendant' | 'floor' | 'table' | 'tech';
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  tag: string;
  specs: { label: string; value: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Consultation {
  id: string;
  customerName: string;
  productName: string;
  query: string;
  date: string;
  status: 'pending' | 'responded';
}

export enum NavigationSection {
  Hero = 'hero',
  Showcase = 'showcase',
  AI = 'ai',
  Contact = 'contact'
}
