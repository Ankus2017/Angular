import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {IProduct} from "./product"
import {ProductService} from "./product.service";
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, Subscription} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {ProductCategoryService} from "../product-categories/product-category.service";
import {IProductCategory} from "../product-categories/product-category";
import {ActivatedRoute} from "@angular/router";

import * as d3 from "d3";
import * as nv from "nvd3/build/nv.d3.min.js"

@Component({
  templateUrl: './products-list.component.html',
  styleUrls : [ './products-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit{
  /*

data:any = {
  "200" : 219832,
  "400" : 3794,
  "401" : 89172,
  "200" : 12896
}

   */

  pageTitle: string = "Liste des produits"
  imageWidth: number = 55;
  imageMargin: number = 3;
  showImage: boolean = false;
  getNewData: boolean = true;

  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  categories$ = this.productCategoryService.categorie$;

  private _listFilter: string = '';
  errorMessage : string = '';


  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  private filterSubject = new BehaviorSubject<string>('');
  filterAction$ = this.filterSubject.asObservable();

  products$ : Observable<IProduct[]>;

  filteredProducts$ : Observable<IProduct[]>;

  returnedData : any = [];
  constructor(private productService: ProductService, private productCategoryService : ProductCategoryService, private route: ActivatedRoute) {
  }
  data(){
    var sin = [],
      cos = [];

    for (var i = 0; i < 100; i++) {
      sin.push({x: i, y: Math.sin(i/10)});
      cos.push({x: i, y: .5 * Math.cos(i/10)});
    }

    this.returnedData = [
      {
        values: sin,
        key: 'Sine Wave',
        color: '#ff7f0e'
      },
      {
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      }
    ];
    /*

    return [
      {
        values: sin,
        key: 'Sine Wave',
        color: '#ff7f0e'
      },
      {
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      }
    ];

     */
  }

  ngOnInit(): void {

   this.returnedData = this.data();

    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true);

      d3.select("#chart2 svg")
        .datum([
          {
            "label": "One",
            "value" : 29.765957771107
          } ,
          {
            "label": "Two",
            "value" : 0
          } ,
          {
            "label": "Three",
            "value" : 32.807804682612
          } ,
          {
            "label": "Four",
            "value" : 196.45946739256
          } ,
          {
            "label": "Five",
            "value" : 0.19434030906893
          } ,
          {
            "label": "Six",
            "value" : 98.079782601442
          } ,
          {
            "label": "Seven",
            "value" : 13.925743130903
          } ,
          {
            "label": "Eight",
            "value" : 5.1387322875705
          }
        ])
        .transition().duration(350)
        .call(chart);

      return chart;
    });

    nv.addGraph(function() {
      var chart = nv.models.lineChart()
        .useInteractiveGuideline(true)
      ;

      chart.xAxis
        .axisLabel('Time (ms)')
        .tickFormat(d3.format(',r'))
      ;

      chart.yAxis
        .axisLabel('Voltage (v)')
        .tickFormat(d3.format('.02f'))
      ;

      var sin = [],
        cos = [];

      for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: Math.sin(i/10)});
        cos.push({x: i, y: .5 * Math.cos(i/10)});
      }
      d3.select('#chart svg')
        .datum([
          {
            values: sin,
            key: 'Sine Wave',
            color: '#ff7f0e'
          },
          {
            values: cos,
            key: 'Cosine Wave',
            color: '#2ca02c'
          }
    ])
        .transition().duration(500)
        .call(chart)
      ;

      nv.utils.windowResize(chart.update);

      return chart;
    });


    this.listFilter = this.route.snapshot.queryParamMap.get('filterBy') || '';

    this.showImage =   this.route.snapshot.queryParamMap.get('showImage') === 'true';

    if(this.productService.recharge === 'no'){
      this.getNewData = false;
    }

    console.log(this.getNewData);
    if(this.getNewData){
      console.log('get new data ')
      this.products$ = combineLatest([
        this.productService.productsWithCategory$,
        this.categorySelectedAction$,
      ]).pipe(
        tap(data => console.log('PRODUCT LIST combine productswithcategories and category selected before:', JSON.stringify(data))),
        map(([products, selectedCategoryId]) =>
          products.filter(product =>
            selectedCategoryId ? product.categoryId === selectedCategoryId : true
          )
        ),
        tap(data => console.log('PRODUCT LIST combine productswithcategories and category selected efter:', JSON.stringify(data))),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        })
      );


      this.filteredProducts$ = combineLatest([
        this.products$,
        this.filterAction$
      ]).pipe(
        tap(data => console.log(`PRODUCT LIST filtered products before filter ${JSON.stringify(data)}`)),
        map(([products, filterBy]) =>
            products.filter(
              (product:IProduct) => product.productName.toLocaleLowerCase().includes(filterBy)
            ) as IProduct[]
        ),
        tap(data => console.log(`PRODUCT LIST filtered products after filter${JSON.stringify(data)}`)),
        tap(data => {
          let products$: Observable<IProduct[]>;
          products$ = of(data);
          this.productService.rechargeProducts$ =   products$;
        }),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        })
      );
    }else{
      console.log(`RECHARHE PRODUCts `);
      this.filteredProducts$ = this.productService.rechargeProducts$;
    }


  }


  get listFilter(): string{
    return this._listFilter;
  }

   set listFilter(value) {
     this._listFilter = value;
     this.filterProducts(this._listFilter);
   }

   filterProducts(filter:string): void{
     let filterby = filter.toLocaleLowerCase();
     this.filterSubject.next(filterby);
   }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }



  onSelected(categoryId: string): void {
   this.categorySelectedSubject.next(+categoryId)
  }

  onRatingClicked(message: string): void{
    this.pageTitle = 'Liste des produits: ' + message;
  }

}
