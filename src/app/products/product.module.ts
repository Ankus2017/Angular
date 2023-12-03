import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from "@angular/router";

import {ProductsListComponent} from "./products-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import { ProductEditComponent } from './product-edit/product-edit.component';
import {ProductDetailGuard} from "./product-detail/product-detail.guard";

import {ConvertToSpacesPipe} from "../shared/convert-to-spaces.pipe";
import { SharedModule } from '../shared/shared.module';
import {ProductEditGuard} from "./product-edit/product-edit.guard";
import {ProductResolver} from "./product-resolver.service";
import {ProductEditInfoComponent} from "./product-edit/product-edit-info.component";
import {ProductEditTagsComponent} from "./product-edit/product-edit-tags.component";

import { AuthGuard} from "../user/auth.guard";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {ProductEditSuppComponent} from "./product-edit/product-edit-supp.component";


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductDetailComponent,
    ConvertToSpacesPipe,
    ProductEditComponent,
    ProductEditInfoComponent,
    ProductEditTagsComponent,
    ProductEditSuppComponent
  ],
  imports: [
    RouterModule.forChild([
          {path: '', component: ProductsListComponent},
          {path: ':id', canActivate : [ProductDetailGuard], component: ProductDetailComponent},
          {
            path: ':id/edit',
            component: ProductEditComponent,
            //resolve : {resolvedData: ProductResolver},
            children: [
              { path: '', redirectTo: 'info', pathMatch: 'full'},
              { path: 'info', component: ProductEditInfoComponent,    canDeactivate : [ProductEditGuard]},
              { path: 'tags', component: ProductEditTagsComponent, canDeactivate : [ProductEditGuard]},
              { path: 'supp', component: ProductEditSuppComponent, canDeactivate : [ProductEditGuard]}
            ]
          }
    ]),
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ]
})
export class ProductModule { }
