import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControlName, FormGroup, Validators} from "@angular/forms";
import {fromEvent, merge, Observable, Subscription} from "rxjs";
import {IProduct} from "../product";
import {GenericValidator} from "../../shared/generic-validator";
import {ProductService} from "../product.service";
import {MessageService} from "../../messages/message.service";
import {NumberValidators} from "../../shared/number.validator";
import {debounceTime} from "rxjs/operators";
import {IProductCategory} from "../../product-categories/product-category";
import {ProductCategoryService} from "../../product-categories/product-category.service";

@Component({
  templateUrl: "./product-edit-info.component.html"
})
export class ProductEditInfoComponent implements OnInit, AfterViewInit{
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  productInfoForm: FormGroup;

  //TODO add product ne marche pas a cause de categories ??
  errorMessage: string;

  product: IProduct;
  releaseDate: Date;

  categories$: Observable<IProductCategory[]>;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private messageService: MessageService,
              private productCategoryService: ProductCategoryService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.'
      },
      productCode: {
        required: 'Product code is required.'
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).'
      },
      price: {
        pattern: 'It has to be  float'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    //TODO change prix !!!
    this.productInfoForm = this.fb.group({
      productName: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      price: ['', Validators.pattern(new RegExp(/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/))],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      releaseDate: ['', Validators.required]
    });

    /*

    this.route.parent.data.subscribe(data =>{

      console.log(`edit-info-comp : data from parent ${JSON.stringify(data)}`);
      this.product = data['resolvedData'].product;
      this.errorMessage = data['resolvedData'].error;
      this.displayProduct(data['resolvedData'].product);
    })

     */



      //TODO corriger does not change on add product
      this.route.parent.params.subscribe( (params) => {
        console.log(params.id)
        if(+params.id === 0){
          this.product = this.productService.initializeProduct()
          //this.releaseDate =  new Date();
        }else{
          if(this.productService.currentProduct && this.productService.currentProduct.id == +params.id){
            this.product = this.productService.currentProduct;
          }else{
            this.product = this.productService.productToEditChosen(+params.id);
          }
           this.releaseDate = new Date(this.product.releaseDate);
        }
      })



    this.categories$ =  this.productCategoryService.categorie$
    this.displayProduct();


   // let productId = this.route.parent.snapshot.paramMap.get('id');

    /*
    this.productService.productToEdit$.subscribe(
      {
        next: product => { this.product = product, console.log(`PRODUCT EDIT INFO ${product}`), this.displayProduct(product) },
        error : err => { this.errorMessage = `\n ${err.message}` }
      }
    )

     */

  }


  displayProduct(): void {

    if (this.productInfoForm) {
      this.productInfoForm.reset();
    }


    // Update the data on the form
    this.productInfoForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description,
      categoryId: this.product.categoryId,
      price: this.product.price,
      releaseDate: this.releaseDate
    });

  }

  saveProduct(): void {
    if (this.productInfoForm.valid) {
      console.log(`${JSON.stringify(this.productInfoForm.value)}`);
      console.log("save Product valid ")
      if (this.productInfoForm.dirty) {
        console.log("save Product dirty ")
        console.log(`${JSON.stringify(this.productInfoForm.value)}`);
        this.productInfoForm.value.categoryId = +this.productInfoForm.value.categoryId;
        console.log(`${JSON.stringify(this.productInfoForm.value)}`);
        const p = { ...this.product, ...this.productInfoForm.value };
      //  p.releaseDate.toString();
        if (p.id === 0) {

          this.productService.createProduct(p)
            .subscribe({
              next: (createdProduct) => {this.productService.currentProduct = createdProduct; console.log(`${JSON.stringify(this.productService.currentProduct)}`); this.productService.recharge ='yes';  this.onSaveComplete() },
              error: err => this.errorMessage = err
            });
        } else {

          this.productService.updateProduct(p)
            .subscribe({
              next: (updatedProduct) => {this.productService.currentProduct = updatedProduct; console.log(`update info product ${JSON.stringify(this.productService.currentProduct)}`); this.productService.recharge ='yes'; this.onSaveComplete() },
              error: err => this.errorMessage = err
            });
        }

      } else {
        this.productService.recharge ='no'
        this.onSaveComplete();
      }
    } else {
      console.log("save Product not valid ")
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    // Reset the form to clear the flags
    if (message) {
      this.messageService.addMessage(message);
    }

    this.productInfoForm.reset();
    if(this.productService.recharge == 'yes'){
      console.log('onSaveComplete recharge yes ')
      this.router.navigateByUrl(`/products/${this.product.id}/edit/tags`);
    }else{
      this.router.navigate(['/products']);
    }


  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.productInfoForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.productInfoForm);
    });
  }


}
