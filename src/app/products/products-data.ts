import {IProduct} from "./product";

export class ProductData {

static products: IProduct[] = [
  {
  id: 1,
  productName: 'Leaf Rake',
  productCode: 'GDN-0011',
  description: 'Leaf rake with 48-inch wooden handle',
  price: 19.95,
    starRating: 3.2,
    imageUrl: "assets/images/leaf_rake.png",
    releaseDate: "May 21, 2021",
  categoryId: 1,
  quantityInStock: 15,
  supplierIds: [1, 2],
    tags: ['rake', 'leaf', 'yard', 'home']
  },
  {
    id: 2,
  productName: 'Garden Cart',
  productCode: 'GDN-0023',
  description: '15 gallon capacity rolling garden cart',
  price: 32.99,
  categoryId: 1,
    starRating: 4.2,
    imageUrl: "assets/images/garden_cart.png",
    releaseDate: "May 21, 2021",
  quantityInStock: 2,
  supplierIds: [3, 4]
  },
  {
    id: 3,
  productName: 'Hammer',
  productCode: 'TBX-0048',
  description: 'Curved claw steel hammer',
  price: 8.9,
  categoryId: 3,
    starRating: 4.8,
    imageUrl: "assets/images/hammer.png",
    releaseDate: "May 21, 2021",
  quantityInStock: 8,
  supplierIds: [5, 6],
    tags: ['tools', 'hammer', 'construction']
  },
  {
    id: 4,
  productName: 'Saw',
  productCode: 'TBX-0022',
  description: '15-inch steel blade hand saw',
  price: 11.55,
  categoryId: 3,
    starRating: 3.7,
    imageUrl: "assets/images/saw.png",
    releaseDate: "May 21, 2021",
  quantityInStock: 6,
  supplierIds: [7, 8]
  },
  {
    id: 5,
  productName: 'Video Game Controller',
  productCode: 'GMG-0042',
  description: 'Standard two-button video game controller',
  price: 35.95,
  categoryId: 5,
    starRating: 4.6,
    imageUrl: "assets/images/xbox-controller.png",
    releaseDate: "May 21, 2021",
  quantityInStock: 12,
  supplierIds: [9, 10]
  },
  {
    id: 6,
    productName: 'console',
    productCode: 'GMG-0042',
    description: 'Standard console',
    price: 35.95,
    categoryId: 5,
    starRating: 4.6,
    imageUrl: "assets/images/xbox-controller.png",
    releaseDate: "May 21, 2021",
    quantityInStock: 12
  }
  ];
}
