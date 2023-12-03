import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IProduct} from "../product";
import {ProductService} from "../product.service";
import {catchError, map, tap} from "rxjs/operators";
import {combineLatest, EMPTY, Observable, of, Subject} from "rxjs";
import {ISupplier} from "../../suppliers/supplier";
import {createGoogleGetMsgStatements} from "@angular/compiler/src/render3/view/i18n/get_msg_utils";

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {


  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  showSupp : boolean;

  pageTitle$;

  product$: Observable<IProduct>;

  product;

  productSuppliers$ : Observable<ISupplier[]>;

  productSuppliers : ISupplier[];
  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));

    if(this.productService.currentProduct && this.productService.currentProduct.id == productId){


      //TODO
      this.product$ = of(this.productService.currentProduct);
      console.log('if current product set and has the same id as url')
      console.log(`product detail current product ${JSON.stringify(this.productService.currentProduct)}`)

    }else{
      console.log('current product has diffrend id than in url so get new product')
      this.product$ = this.productService.selectedProductChanged(productId);

      console.log("'sdfgsdfg")

      this.product$.subscribe({
        next: (product) => {
          this.product = product;
          console.log(`${JSON.stringify(product)}`);
          if(!this.product){
            this.errorMessageSubject.next('The product was not found');
          }
           },
      //  error: err => this.errorMessage = err
      });
      //TODO debug why not pipe //try subscribe
      /*
      this.product$.pipe(
        map(data => {
          if(data){
            console.log(`product detail prouduct  found !!!!! ${data}`)
            return data;
          }else{
            console.log(`product detail prouduct not found !!!!! ${data}`)
            return this.errorMessageSubject.next('error');
          }}),
      )

       */
    }



    this.pageTitle$ = this.product$.pipe(
      tap( p => console.log(`ici ${JSON.stringify(p)}`)),
      map((p: IProduct) =>
        p ? `Fiche produit: ${p.productName}` : null)
    );
  }

  showSuppliers(){
    this.showSupp = true;
  //TODO debug current product, reset suppliers
    if(this.productService.currentProduct.supplierIds.length != 0){

      this.productSuppliers$ = this.productService.setProductSuppliers(this.product$);

      this.productSuppliers$.pipe(
        tap( suppliers => console.log(`ici ${JSON.stringify(suppliers)}`)),
        tap( suppliers => this.productSuppliers = suppliers),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        })
      );
    }else{
      //TODO finish code
    }


    }


  /*
  product$ = this.productService.selectedProduct$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  */


}
