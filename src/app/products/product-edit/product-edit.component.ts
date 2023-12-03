import { ActivatedRoute, Router} from "@angular/router";

import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';

import {ProductService} from '../product.service';

import {IProduct, IProductEditData} from "../product";
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";

import { MessageService } from '../../messages/message.service';
import {catchError} from "rxjs/operators";
import {EMPTY, of} from "rxjs";


@Component({
  templateUrl: './product-edit.component.html',
  styleUrls : [ './product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  pageTitle = 'Modifier un produit';
  errorMessage: string;


  private product: IProduct;


  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {

    /*
    this.route.data.subscribe(data=>{
      const resolvedData: IProductEditData = data['resolvedData'];
      this.errorMessage = resolvedData.error;
      this.onProductRetrieved(resolvedData.product);
    });

     */
    this.route.params.subscribe( (params) => {
      console.log(params.id)

      //TODO faire une fonction
      if (isNaN(+params.id)) {
        this.errorMessage = `Product id was not a number: ${params.id}`;
      }else {

        if(+params.id === 0){
          console.log('add product')
          this.pageTitle = 'Add Product';
          this.product = this.productService.initializeProduct();

        }else{

          if(this.productService.currentProduct && this.productService.currentProduct.id == +params.id){
            this.product = this.productService.currentProduct;
          }else{
            this.product = this.productService.productToEditChosen(+params.id);
          }


          this.pageTitle = `Edit Product: ${this.product.productName}`;

          /*
          this.productService.productToEdit$.subscribe(
            {
              next: product => { this.product = product, this.pageTitle = `Edit Product: ${product.productName}`},
              error : err => { this.errorMessage = `\n ${err.message}` }
            }
          )

           */

        }
      }
    })


    }


  /*
  getProduct(id: number): void {
    this.productService.getProduct(id)
      .subscribe({
        next: (product: IProduct) => this.displayProduct(product),
        error: err => this.errorMessage = err
      });
  }

  displayProduct(product: IProduct): void {
    this.product = product;

    if (this.product.id === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
    }
  }
  */


  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.productService.recharge = 'no';
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id)
          .subscribe({
            next: () => {  this.onSaveComplete() },
            error: err => this.errorMessage = err
          });
      }
    }
  }


  onSaveComplete( message?: string): void {
    // Reset the form to clear the flags
    if (message) {
      this.messageService.addMessage(message);
    }
    this.router.navigate(['/products']);
  }

  cancel(){
    //TODO tester may cause bugs
    //this.productService.recharge = 'no';
    this.router.navigate(['/products',this.product.id ]);
  }

}
