import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class SharedService {
  constructor(private http: HttpClient) { }
  states = ['01 - Ain', '02 - Aisne', '03 - Allier', '04 - Alpes-de-Haute-Provence', '05 - Hautes-Alpes', '06 - Alpes Maritimes', '07 - Ardèche', '08 - Ardennes', '09 - Ariège ', '10 - Aube', '11 - Aude', '12 - Aveyron', '13 - Bouches-du-Rhône'];
}
