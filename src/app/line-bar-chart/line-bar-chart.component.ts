import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import {interval, Observable, of, Subscription, timer} from 'rxjs';
import {map, switchMap, tap} from "rxjs/operators";
import {IProduct} from "../products/product";



@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrls: ['./line-bar-chart.component.css']
})
export class LineBarChartComponent implements OnInit {

  pageTitle$;

  chartData3$: Observable<ChartDataSets[]> = of([
    {data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90], label: 'YES'},
    {data: [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10], label: 'NO'}
  ])
  subscription: Subscription;
  chartType: ChartType = "line";
  chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


  chartData: ChartDataSets[] = [
    {data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90], label: 'YES'},
    {data: [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10], label: 'NO'}
  ];



  /*
  const source = interval(10000);
  const text = 'Your Text Here';
  this.subscription = source.subscribe(val => this.opensnack(text));
*/
  interval = setInterval(() => {
    this.generateRandom();
  }, 5000);


    generateRandom() : number{
    return Math.floor(Math.random() * 10);
  }


  constructor() { }
  /*
  setChartData() : ChartDataSets[]{
      return
  }

   */



  ngOnInit(): void {
    interval(2000).subscribe(() => {

      let chartData4:  ChartDataSets[] = [
        {data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 88, 90], label: 'YES'},
        {data: [15, 28, 22, 25, 23, 25, 15, 28, 22, 25, 12, 10], label: 'NO'}
      ];

      let updatedChartData = chartData4;
      // call
      for (let i = 0; i < chartData4[0].data.length; i++) {
        updatedChartData[0].data[i] = this.generateRandom();
      }

      for (let i = 0; i < chartData4[1].data.length; i++) {
        updatedChartData[1].data[i] = this.generateRandom();
      }
   //  console.log(`${JSON.stringify(updatedChartData)}`)

      this.chartData3$ = of(updatedChartData);
      //this.chartData3$.subscribe();

      this.pageTitle$ = of(`Fiche produit: ${this.generateRandom()}` ) ;

      console.log(this.generateRandom())
    });
  }


}
