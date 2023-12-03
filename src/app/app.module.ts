import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";

import { AppComponent } from './app.component';
import {WelcomeComponent} from "./home/welcome.component";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


//Imports for loading & configuring the in-memory web api
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import { AppData } from './app-data';
import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import * as d3 from "d3";
import * as nv from "nvd3/build/nv.d3.min.js"

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {ChartsModule} from "ng2-charts";
import { LineBarChartComponent } from './line-bar-chart/line-bar-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    LineBarChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(AppData),
    UserModule,
    MessagesModule,
    AppRoutingModule,
    ChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
