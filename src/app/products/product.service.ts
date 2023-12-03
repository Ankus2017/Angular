import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, throwError, combineLatest, forkJoin, BehaviorSubject, Subject, merge, of, EMPTY, from} from 'rxjs';
import {
  catchError,
  map,
  scan,
  shareReplay,
  tap,
  filter,
  switchMap,
  mergeMap,
  toArray,
  withLatestFrom, concatMap
} from 'rxjs/operators';



import { ISupplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import {IProduct} from "./product";
import {ProductCategoryService} from "../product-categories/product-category.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private productsUrl = 'api/products';

  private suppliersUrl = this.supplierService.suppliersUrl;

  private products: IProduct[];

  currentProduct: IProduct;

  recharge: string = 'yes'

  rechargeProducts$: Observable<IProduct[]>;
  products$: Observable<IProduct[]> =  this._http.get<IProduct[]>(this.productsUrl)
    .pipe(
      tap(data => console.log('PRODUCT SERVICE products http: ', JSON.stringify(data))),
      tap(data => this.products = data),
      catchError(this.handleError)
    );


  productsWithCategory$ = combineLatest([
      this.products$,
      this.productCategoryService.productCategories$,
    ]).pipe(
    tap(data => console.log('PRODUCT SERVICE combine products with categories before map: ', JSON.stringify(data))),
      map(([products, categories]) =>
        products.map(product => ({
          ...product,
          categoryName: categories.find(c => product.categoryId === c.id).categoryName
        }) as IProduct)
      ),
      tap(data => console.log('PRODUCT SERVICE combine products with categories : ', JSON.stringify(data))),
      tap(data => {this.products = data})

    );

  //private productsListModifiedSubject = new BehaviorSubject<number|IProduct>(0);
 // productsListModifiedAction$ = this.productsListModifiedSubject.asObservable();

   private productSelectedSubject = new BehaviorSubject<number>(0);
    productSelectedAction$ = this.productSelectedSubject.asObservable();

  //TODO corriger error handling
  /*
  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    tap(data => console.log('PRODUCT SERVICE product selected for detail before map: ', JSON.stringify(data))),
    map( ([products, selectedProductId]) =>
        products.find( product => product.id === selectedProductId)
    ),
    tap(data => console.log('PRODUCT SERVICE product selected for detail after map : ', JSON.stringify(data))),
  )*/

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    tap(data => console.log('PRODUCT SERVICE product selected for detail before map: ', JSON.stringify(data))),
    map( ([products, selectedProductId]) =>
      products.find( product => product.id === selectedProductId)
    ),
    map(data => {
      if(data){
        return data;
      }else{
        return null;
    }
}),
    tap(data => console.log('PRODUCT SERVICE product selected for detail after map : ', JSON.stringify(data))),
  )



  selectedProductSuppliers$: Observable<ISupplier[]>;

  productSuppliers: ISupplier[];



  /*
private productToEditSubject = new BehaviorSubject<number>(0);
productToEditAction$ = this.productToEditSubject.asObservable();

productToEdit$ = combineLatest([
  this.productsWithCategory$,
  this.productToEditAction$
]).pipe(
  map( ([products, productToEditId]) =>
      products.find( product => product.id === productToEditId)
  ),
  shareReplay(1),
  //TODO detail error handling where product id not found
  tap(data => console.log('PRODUCT SERVICE product selected for edit : ', JSON.stringify(data)))
)

 */

  constructor(private _http: HttpClient,
              private supplierService: SupplierService,
              private productCategoryService: ProductCategoryService)
  {
  }

  selectedProductChanged(selectedProductId : number) : Observable<IProduct> {

    if (this.products) {
      console.log(`selected product changed if products ${this.products}`);
      const foundItem = this.products.find(item => item.id === selectedProductId);
      if (foundItem) {
        this.currentProduct = foundItem;
        return  of(foundItem);
      }else{
        return null;
      }
    }else{
      //TODO debug not working
      console.log('can not find products call Selected Subject');

      this.productSelectedSubject.next(selectedProductId);

      return  this.selectedProduct$;

    }
  }

  setProductSuppliers(product$ : Observable<IProduct>):  Observable<ISupplier[]>{
    console.log("setProductSuppliers");
    return product$
      .pipe(
        filter(selectedProduct => Boolean(selectedProduct)),
        switchMap(selectedProduct =>
          from(selectedProduct.supplierIds)
            .pipe(
              mergeMap(supplierId => this._http.get<ISupplier>(`${this.suppliersUrl}/${supplierId}`)),
              toArray(),
              tap(suppliers =>console.log('PRODUCT SERVICE product suppliers for detail setProductSuppliers', JSON.stringify(suppliers))),
              tap(suppliers => this.productSuppliers = suppliers)

            )
        )
      );


  }

  productToEditChosen(productToEditId: number): IProduct {
    console.log(`productToEditChosen ${productToEditId}`);

    if (this.products) {
      const foundItem = this.products.find(item => item.id === productToEditId);
      if (foundItem) {
       return foundItem;
      }else{
        //TODO corriger
        return this.fakeProduct();
      }
    }else{
      //TODO corriger
      return this.fakeProduct();
     // this.productToEditSubject.next(productToEditId);
    }
  }


  addProduct(newProduct?:IProduct){
    newProduct = newProduct || this.fakeProduct();
    console.log('on add product service')
  }

  /*
    getProducts(): Observable<IProduct[]> {
      return this._http.get<IProduct[]>(this.productsUrl)
        .pipe(
          tap(data => console.log('Produits: ', JSON.stringify(data))),
          catchError(this.handleError)
        );
    }


    getProduct(id: number): Observable<IProduct | undefined> {
      return this.getProducts()
        .pipe(
          map((products: IProduct[]) => products.find(p => p.id === id))
        );
    }

     */

  getProduct(id: number): Observable<IProduct> {
    if(id ===0){
      return of(this.initializeProduct())
    }
    const url = `${this.productsUrl}/${id}`;
    return this._http.get<IProduct>(url).pipe(
      tap(data => console.log('PRODUCT SERVICE get product http: ', JSON.stringify(data))),
      //TODO alphabetize the tags, calculate the number of days since the product was realeased
      catchError(this.handleError)
    );
  }
  //(person => person.age >= 30)


/*
  getProductResolver(id: number): Observable<IProductResolved> {
    let categories;

    this.productCategoryService.productCategories$.subscribe( cat => {
      console.log(cat);
      categories = cat
    });

    if(id ===0){
      return of({product: this.initializeProduct(),  categories: categories, error: 'null'})
    }
    console.log(id);
    let productOb$;
    let productResolved;
    productOb$ =  this.productsWithCategory$.pipe(

      map((products:IProduct[]) => products.find(p => p.id === id) as IProduct)


    );

    productOb$.subscribe({
      next: product => productResolved = product
    });

    console.log( ` sdfqsf ${JSON.stringify(productResolved)}`);
    return of({product: productResolved,  categories: categories, error: 'null'});
  }

 */

  initializeProduct(): IProduct {
    // Return an initialized object
    return {
      id: 0,
      productName: null,
      productCode: null,
      tags: [''],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }

  private fakeProduct(): IProduct {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Un nouveau produit',
      price: 8.9,
      categoryId: 3,
      starRating: 2,
      quantityInStock: 30
    };
  }

  createProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    product.id = null;
    return this._http.post<IProduct>(this.productsUrl, product, { headers })
      .pipe(
        tap(data => console.log('PRODUCT SERVICE createProduct: ' + JSON.stringify(data))),

        catchError(this.handleError)
      );

  }

  deleteProduct(id: number): Observable<{}> {
    //TODO retest ne marche pas avec share reply de productwithcategories
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${id}`;
    return this._http.delete<IProduct>(url, { headers })
      .pipe(
        tap(data => console.log('PRODUCT SERVICE deleteProduct: : ' + id)),
        catchError(this.handleError)
      );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    //TODO retest ne marche pas avec share reply de productwithcategories
    console.log(`updateproduct ${JSON.stringify(product)}`);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product.id}`;
    return this._http.put<IProduct>(url, product, { headers })
      .pipe(
        tap(() => console.log(`PRODUCT SERVICE  updatedProduct: ${JSON.stringify(product)}`)),
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
