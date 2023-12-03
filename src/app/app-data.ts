import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ProductData} from "./products/products-data";
import { ProductCategoryData} from "./product-categories/products-category-data";
import { SupplierData } from './suppliers/supplier-data';
import { IProduct } from './products/product';
import { IProductCategory} from "./product-categories/product-category";
import { ISupplier } from './suppliers/supplier';


export class AppData implements InMemoryDbService {

  createDb(): { products: IProduct[], productCategories: IProductCategory[], suppliers: ISupplier[]} {
    const products = ProductData.products;
    const productCategories = ProductCategoryData.categories;
    const suppliers = SupplierData.suppliers;
    return { products, productCategories, suppliers };
  }
}
