import { IProductCategory } from './product-category';

export class ProductCategoryData {

  static categories: IProductCategory[] = [
    {
      id: 1,
      categoryName: 'Garden'
    },
    {
      id: 3,
      categoryName: 'Toolbox'
    },
    {
      id: 5,
      categoryName: 'Gaming'
    }
  ];
}
