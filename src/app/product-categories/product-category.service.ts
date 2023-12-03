import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {throwError, Observable, EMPTY} from 'rxjs';
import { IProductCategory } from './product-category';
import {catchError, shareReplay, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private productCategoriesUrl = 'api/productCategories';

  constructor(private _http: HttpClient) { }

  productCategories$ = this._http.get<IProductCategory[]>(this.productCategoriesUrl).pipe(
    tap(data => console.log('Categories :', JSON.stringify(data))),
   // shareReplay(1),
    catchError(this.handleError)
  )

    categorie$ = this.productCategories$.pipe(
      catchError(err => {
        catchError(this.handleError)
    return EMPTY;
     }),
    shareReplay(1)
  )

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
