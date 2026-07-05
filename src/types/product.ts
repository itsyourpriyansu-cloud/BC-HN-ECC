export interface ProductWithRelations {
  id: string;
  name: string;
  description: string;
  category: string;
  fabric: string;
  threadCount: number | null;
  gsm: number | null;
  careInstructions: string;
  basePrice: number;
  rating: number;
  ratingCount: number;
  images: { id?: string; url: string; order: number }[];
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    colorCode: string;
    stock: number;
    priceAdjustment: number;
  }[];
}
