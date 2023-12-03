import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {throwError, Observable, of} from 'rxjs';
import {catchError, concatMap, map, mergeMap, shareReplay, switchMap, tap} from "rxjs/operators";
import {ISupplier} from "./supplier";
import {IProductCategory} from "../product-categories/product-category";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
 suppliersUrl = 'api/suppliers';

 // suppliersUrl = 'api/products/suppliers.json'

 suppliers$ = this._http.get<ISupplier[]>(this.suppliersUrl).pipe(
    tap(data => console.log('suppliers :', JSON.stringify(data))),

  shareReplay(1),
  catchError(this.handleError)
)
  /*

 suppliers$ = of(1,5,8).pipe(
   map(id=>this._http.get<ISupplier>(`${this.suppliersUrl}/${id}`))
 )

  suppliersWithConcatMap$ = of(1,5,8).pipe(
    tap( data  => console.log('source concat', data)),
   concatMap(id=>this._http.get<ISupplier>(`${this.suppliersUrl}/${id}`))
  )

  suppliersWithMergeMap$ = of(1,5,8).pipe(
    tap( data  => console.log('source merge', data)),
    mergeMap(id=>this._http.get<ISupplier>(`${this.suppliersUrl}/${id}`))
  )

  suppliersWithSwitchMap$ = of(1,5,8).pipe(
    tap( data  => console.log('source switch', data)),
    switchMap(id=>this._http.get<ISupplier>(`${this.suppliersUrl}/${id}`))
  )

   */
  constructor(private _http: HttpClient) {
   /*
    this.suppliers$.subscribe( o => o.subscribe(
        item => console.log(item)
    ))

    this.suppliersWithConcatMap$.subscribe(
      item => console.log('concatMap result', item)
    )

    this.suppliersWithMergeMap$.subscribe(
      item => console.log('mergeMap result', item)
    )


    this.suppliersWithSwitchMap$.subscribe(
      item => console.log('switchMap result', item)
    )

    */
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
