import { NgModule } from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import { LoginComponent } from './login.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: 'login', component : LoginComponent }
    ])
  ]
})
export class UserModule { }
