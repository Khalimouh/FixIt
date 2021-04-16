import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  constructor(private sharedS: SharedService) {}
  lgScreen = false;
  states = this.sharedS.states;
  minDate1: Date;
  minDate2: Date;
  Date1: Date;

  ngOnInit(): void {

    this.minDate1 = new Date();
    this.minDate1.setDate(this.minDate1.getDate() + 1);
  }

  date1Selected(e) {
    this.Date1 = new Date(e.value);
    this.minDate2 = new Date(e.value);
    this.minDate2.setDate(this.minDate2.getDate());
  }
}
