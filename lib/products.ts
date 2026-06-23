export interface Product {
  id: number | string;
  title: string;
  price: number;
  material: string;
  category: string;
  subcategory?: string;
  occasion: "Formal" | "Casual" | "Workwear";
  color: "white" | "black" | "grey" | "tan";
  image: string;
  galleryImages: string[]; // Bento images [Hero, Detail, Lifestyle]
  rating: number;
  reviewsCount: number;
  description: string;
  aiRecommendation: string;
  completeTheLook: Array<{
    id?: number | string;
    title: string;
    price: number;
    image: string;
  }>;
  sizes?: string[];
  created_at?: string;
  stock_quantity?: number;
}

