import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import {ProductEditComponent} from "./product-edit.component";
import {ProductEditInfoComponent} from "./product-edit-info.component";
import {ProductEditTagsComponent} from "./product-edit-tags.component";

@Injectable({
  providedIn: 'root'
})
export class ProductEditGuard implements CanDeactivate<ProductEditInfoComponent | ProductEditTagsComponent> {

  canDeactivate(component: ProductEditInfoComponent | ProductEditTagsComponent): Observable<boolean> | Promise<boolean> | boolean {

      if (
          ( (component instanceof ProductEditInfoComponent) && component.productInfoForm.dirty ) ||
          ( (component instanceof ProductEditTagsComponent) && component.productTagsForm.dirty )
        ) {
        console.log('edit guard');
        const productName = component.product.productName || 'Nouveau Produit';
        return confirm(`Navigate away and lose all changes to ${productName}?`);
      }
      return true;
    }


}
