import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";

@Component({
  selector: 'ms-star',
  templateUrl: './star.component.html',
  styleUrls : [ './star.component.css']

})
export class StarComponent implements OnChanges{
  cropWidth: number = 75;
  @Input() rating : number = 0;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(): void {
    this.cropWidth = this.rating * 75/5;
  }

  onStarClick(): void {
    this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
  }
}
