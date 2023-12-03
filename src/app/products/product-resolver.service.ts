import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map, catchError, tap, shareReplay} from 'rxjs/operators';

import {IProduct, IProductEditData} from './product';
import { ProductService } from './product.service';
import {ProductCategoryService} from "../product-categories/product-category.service";
import {IProductCategory} from "../product-categories/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<IProductEditData> {

  //TODO usunac ten resolver
  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<IProductEditData> {
    const productId = route.paramMap.get('id');
    let message;
    if (isNaN(+productId)) {
      message = `Product id was not a number: ${productId}`;
      console.error(message);
      return of({ product: null, categories: null, error: message });
    }

    let categories: IProductCategory[];

    this.productCategoryService.categorie$.subscribe({
      next: productCat => {categories = productCat},
      error : err => { message += `\n ${err.message}` }
    })

    let productToEdit$ :Observable<IProduct>;
    let productToEdit: IProduct;
    if(+productId === 0){
      productToEdit$ = of(this.productService.initializeProduct());
    }else{
      productToEdit$ = this.productService.getProduct(+productId);

      let productToEditWithCategory$: Observable<IProduct>;

      productToEditWithCategory$ = combineLatest([
        productToEdit$,
        this.productCategoryService.categorie$
      ]).pipe(
        map(([product, categories]) =>
          ({
            ...product,
            categoryName: categories.find(c => product.categoryId === c.id).categoryName,
            searchKey: [product.productName]
          } as IProduct)
        ),
        tap(data => console.log('after combine latest productToEDIT with categoreis : ', JSON.stringify(data))),
      );

      productToEditWithCategory$.subscribe({
          next: product => { productToEdit = product, console.log(`PRODUCT to edit resolver ${product}`)},
          error : err => { message += `\n ${err.message}` }
        }
      )

    }




    return of({product: productToEdit, categories: categories, error: message});


   // let resolvedProduct = this.productService.getProductResolver(+id);

    //console.log(`resolvedProduct ${JSON.stringify(resolvedProduct)}`);
  //  return resolvedProduct;

   /*
    return this.productService.getProduct(+id)
      .pipe(
        map(product => ({ product })),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );


    */
  }


}
