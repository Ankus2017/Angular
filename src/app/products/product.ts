import {IProductCategory} from "../product-categories/product-category";

export interface IProduct {
  id: number;
  productName: string;
  productCode: string;
  description?: string;
  releaseDate?: string;
  price: number;
  categoryId?: number;
  categoryName?: string;
  quantityInStock?: number;
  searchKey?: string[];
  supplierIds?: number[];
  starRating: number;
  imageUrl?: string;
  tags?: string[];
}

export interface IProductEditData {
  product: IProduct;
  categories: IProductCategory[],
  error?: string,
}
