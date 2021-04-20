import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  constructor(private sharedS: SharedService, private http: HttpClient) {}
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
    console.log(this.mission, this.prix, this.code);
    let url = "http://localhost:3000/search?";
    const params = new HttpParams()
        .set('metier', this.mission)
        .set('prix', this.prix.toString())
        .set('code', this.code.slice(0,2));
    let headers = new HttpHeaders();
    headers=headers.append('content-type','application/json');
    headers=headers.append('Access-Control-Allow-Origin', '*');
    headers=headers.append('content-type','application/x-www-form-urlencoded');
    //@ts-ignore
    this.http.post(url, {},{'header': headers, 'params':params}).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
    )
  };

}
