import { type ProductUnit } from "@/constants/units";

export interface ProductItemType {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  available: boolean;
  showOnHomepage?: boolean;
  unit: ProductUnit;
  createdAt: string;
}
