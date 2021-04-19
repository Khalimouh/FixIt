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

  mission: string;
  prix: number;
  code: string;
  ngOnInit(): void {
    this.mission = "Mission";
    this.prix = 0;
    this.code = "75";
  }

  doSearch(){
    let url = ""
    console.log(this.mission, this.prix, this.code)
    this.http.
  }
}
