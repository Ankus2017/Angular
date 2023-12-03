import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChildren} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, combineLatest, Observable, of, Subject, Subscription} from "rxjs";
import {IProduct} from "../product";
import {NumberValidators} from "../../shared/number.validator";
import {ProductService} from "../product.service";
import {MessageService} from "../../messages/message.service";
import {SupplierService} from "../../suppliers/supplier.service";
import {ISupplier} from "../../suppliers/supplier";
import {filter, map, tap} from "rxjs/operators";
import {DOCUMENT} from "@angular/common";

@Component({
  templateUrl: "./product-edit-supp.component.html"
})
export class ProductEditSuppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errorMessage: string;
  productSuppForm: FormGroup;
  private sub: Subscription;
  product: IProduct;

  suppliers$ = this.supplierService.suppliers$;

  suppliarsNameArray : string[];

  selectedSuppliersArray :  string[] = [];

  //newSuppliers : ISupplier[];

  suppliersIdsToSave: number[] = [];
  productSuppliers$ : Observable<ISupplier[]>;

  addSupp : boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private productService : ProductService,
              private router: Router,  private messageService: MessageService, private supplierService: SupplierService, @Inject(DOCUMENT) document) {
  }

  private supplierSelectedSubject = new BehaviorSubject<string>('');
  supplierSelectedAction$ = this.supplierSelectedSubject.asObservable();

  newSuppliers$ = combineLatest([
    this.supplierService.suppliers$,
    this.supplierSelectedAction$
  ]).pipe(
    map( ([suppliers, selectedSupplierName]) =>
      suppliers.filter(supp => ( !this.suppliarsNameArray.includes(supp.name)  )
      )
    ),
  //TODO detail error handling where product id not found
  tap(data => console.log('EDIT SUPP COMPONENT suppliers for select: ', JSON.stringify(data))
)
)

  ngOnInit(): void {

    this.productSuppForm = this.fb.group({
      suppliers: this.fb.array([]),
    });

    this.route.parent.params.subscribe( (params) => {
      console.log(params.id)
      if(+params.id === 0){
        this.product = this.productService.initializeProduct()
      }else{
        if(this.productService.currentProduct && this.productService.currentProduct.id == +params.id){
          this.product = this.productService.currentProduct;
        }else{
          this.product = this.productService.productToEditChosen(+params.id);
        }
      }
    })


      let productId = this.route.parent.snapshot.paramMap.get('id');
      if(+productId === 0){
        this.product = this.productService.initializeProduct()
      }else {

        if(this.productService.currentProduct && this.productService.currentProduct.id == +productId){
          this.product = this.productService.currentProduct;
        }else{
          this.product = this.productService.productToEditChosen(+productId);
        }

        console.log(`chosen product ${JSON.stringify(this.product)}`);
      }


    if(this.product.supplierIds)  {
      if(this.productService.productSuppliers){

        //TODO reset ???
        this.productSuppliers$ = of(this.productService.productSuppliers);

      }else{
        this.productSuppliers$ = this.productService.setProductSuppliers(of(this.product));
      }
    }


    //TODO assciate the ids

    this.displaySuppliers();

  }

  displaySuppliers(): void {
    if (this.productSuppForm) {
      this.productSuppForm.reset();
    }


    //TODO debug
    /*
    this.productSuppliers$.pipe(
      map(suppliers => suppliers.map(supplier => suppliersArray.push(supplier.name))),
      tap(supp => {console.log(suppliersArray); this.productSuppForm.setControl('suppliers', this.fb.array(suppliersArray || []));})
    )
    */
    let suppliersArray: string[] = [];

    if(this.product.supplierIds){
      this.productSuppliers$.subscribe({
        next(suppliersObjectArray){

          suppliersObjectArray.forEach(function (supplierObject){
            console.log(supplierObject);
            console.log(supplierObject.name);
            suppliersArray.push(supplierObject.name)
          })},
        complete() { console.log(` done ${suppliersArray}`);  }
      })
    }

    //TODO debug when there is no profucts duppliers

      this.productSuppForm.setControl('suppliers', this.fb.array(suppliersArray))
    this.suppliarsNameArray = suppliersArray;
  }

  get suppliers(): FormArray {
    return this.productSuppForm.get('suppliers') as FormArray;
  }

  addSupplier(): void {
    this.addSupp = true;


    /*
    this.newSuppliers$ = this.supplierService.suppliers$.pipe(
      map(supplier => supplier.filter(supp => !this.suppliarsNameArray.includes(supp.name))),
     // tap(suppliers => this.newSuppliers = suppliers)
    )

     */
  }

  chooseSupplier(value):void{

    this.addSupp = false;
    //TODOD debug why the selected name is still in the list
    //change pour subject
    /*
    this.newSuppliers$ = this.supplierService.suppliers$.pipe(
      map(supplier => supplier.filter(supp => (!this.suppliarsNameArray.includes(supp.name) &&  !this.suppliarsNameArray.includes(value)) ))

      // tap(suppliers => this.newSuppliers = suppliers)
    )
    *
     */
    console.log(value);
    this.suppliarsNameArray.push(value);
    console.log(this.suppliarsNameArray);
    this.suppliers.push(new FormControl(value));
    this.supplierSelectedSubject.next(value);

    this.suppliers.markAsDirty();

  }

  remove(index){
    //this.newSuppliers.splice(index, 1);
  }
  deleteSupplier(index: number, suppName: string): void {
    this.suppliers.removeAt(index);
    console.log(  document.getElementById(index.toString()))
    console.log(suppName);
    let suppIndex = this.suppliarsNameArray.indexOf(suppName)
    console.log(suppIndex);
    console.log( this.suppliarsNameArray);
    this.suppliarsNameArray.splice(suppIndex,1);
    console.log( this.suppliarsNameArray);
    this.supplierSelectedSubject.next('');

  //  console.log(`delete suup ${JSON.stringify(this.suppliers)}`);
    this.suppliers.markAsDirty();
  }

  saveSuppliers(): void{
    if (this.productSuppForm.valid) {
      console.log('valid');
      if (this.productSuppForm.dirty) {
        console.log('dirty');


        let suppliersToSave : Observable<ISupplier[]>= this.supplierService.suppliers$.pipe(
          map( (suppliers) => suppliers.filter(
              supplier => this.productSuppForm.value.suppliers.includes(supplier.name)
            )),

        )

        let suppliersIdsToSave : number[] = [];

        suppliersToSave.subscribe({
          next: (s) => { s.forEach(value => {
            suppliersIdsToSave.push(value.id)
          })
        }});


      console.log(suppliersIdsToSave);

      let suppliersObject = {suppliers: suppliersIdsToSave};

        console.log( `${JSON.stringify(this.productSuppForm.value)}` );

        const p = { ...this.product, ...suppliersObject };

        console.log(`modified product ${p}`);
        if (p.id === 0) {
          this.productService.createProduct(p)
            .subscribe({
              next: () => {this.productService.currentProduct = p, this.productService.recharge = 'yes', this.onSaveSuppliers()},
              error: err => this.errorMessage = err
            });
        } else {
          this.productService.updateProduct(p)
            .subscribe({
              next: () => {this.productService.currentProduct = p, this.productService.recharge = 'yes', this.onSaveSuppliers()},
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveSuppliers();
        console.log('not dirty');
      }
    } else {
      console.log('not valid');
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveSuppliers(message?: string): void {
    // Reset the form to clear the flags
    if (message) {
      this.messageService.addMessage(message);
    }
    this.productSuppForm.reset();
    //TODO recharge product and suppliers
    this.router.navigate(['/products',this.product.id ]);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }
}
