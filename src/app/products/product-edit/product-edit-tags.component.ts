import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {IProduct} from "../product";
import {NumberValidators} from "../../shared/number.validator";
import {ProductService} from "../product.service";
import {MessageService} from "../../messages/message.service";

@Component({
  templateUrl: "./product-edit-tags.component.html"
})
export class ProductEditTagsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errorMessage: string;
  productTagsForm: FormGroup;
  private sub: Subscription;
  product: IProduct;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private productService : ProductService,
              private router: Router,  private messageService: MessageService) {
  }

  ngOnInit(): void {

    this.productTagsForm = this.fb.group({
      tags: this.fb.array([]),
    });


      let productId = this.route.parent.snapshot.paramMap.get('id');
      if(+productId === 0){
        this.product = this.productService.initializeProduct()
      }else {

        if(this.productService.currentProduct && this.productService.currentProduct.id == +productId) {
          this.product = this.productService.currentProduct;
        }else{

        this.product = this.productService.productToEditChosen(+productId);
        console.log(`chosen product ${this.product}`);
      }



    }
    //TODO

    this.displayTags();
    /*
    this.route.parent.data.subscribe(data => {
      this.errorMessage = data['resolvedProduct'].error;
      this.displayTags(data['resolvedProduct'].product);
    })

     */
  }

  displayTags(): void {
    if (this.productTagsForm) {
      this.productTagsForm.reset();
    }

    this.productTagsForm.setControl('tags', this.fb.array(this.product.tags || []));
  }

  get tags(): FormArray {
    return this.productTagsForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  saveTags(): void{
    if (this.productTagsForm.valid) {
      if (this.productTagsForm.dirty) {
        const p = { ...this.product, ...this.productTagsForm.value };

        console.log(`modified product ${p}`);
        if (p.id === 0) {
          this.productService.createProduct(p)
            .subscribe({
              next: () => {this.productService.currentProduct = p, this.productService.recharge = 'yes', this.onSaveTags()},
              error: err => this.errorMessage = err
            });
        } else {
          this.productService.updateProduct(p)
            .subscribe({
              next: () => {this.productService.currentProduct = p, this.productService.recharge = 'yes', this.onSaveTags()},
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveTags();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveTags(message?: string): void {
    // Reset the form to clear the flags
    if (message) {
      this.messageService.addMessage(message);
    }
    this.productTagsForm.reset();

    if(this.productService.recharge == 'yes'){
      console.log('onSaveComplete recharge yes ')
      this.router.navigateByUrl(`/products/${this.product.id}/edit/supp`);
    }else{
      this.router.navigate(['/products',this.product.id ]);
    }


  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }
}
