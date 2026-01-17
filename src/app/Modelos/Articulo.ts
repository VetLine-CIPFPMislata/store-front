import { Category } from "./Category";

export interface Articulo {
    id: number;
    name: string;
    productDescription: string;
    price: number;
    basePrice?: number;
    discountPercentage?: number;
    pictureProduct: string;
    category: Category;
    quantity?: number;
    rating?: number;
}
