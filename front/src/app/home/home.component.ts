import {Component, OnInit, AfterViewInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() {
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    document.getElementsByClassName('content')[0].classList.add('content-bg');
  }
}

