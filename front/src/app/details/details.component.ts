import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  constructor(private location: Location, private http: HttpClient) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');


  }
  headers = new HttpHeaders();
  annonce: any;
s;

  ngOnInit(): void {
    this.fetchServiceDetails(this.location.getState());
  }

  fetchServiceDetails(id){
      console.log(id);
      const url = 'http://localhost:3000/detail';
      this.http.post<any>(url, {_id : id.id}, { headers: this.headers }).subscribe(
        (res) => {
          console.log(res);
          this.annonce = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
