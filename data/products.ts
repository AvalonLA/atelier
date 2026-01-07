import { Product } from '../types';
import productsData from './products.json';

export const allProducts: Product[] = productsData as unknown as Product[];
