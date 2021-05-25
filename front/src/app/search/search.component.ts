import { Component, OnInit } from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {SharedService} from '../mdl-shared/shared.service';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-main-result',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  items: GalleryItem[] = [];
  annonces: any[] = [];
  sub: Subscription;
  IPback: string;

  constructor(private sharedS: SharedService) {
    this.IPback = this.sharedS.IPback;
  }

  ngOnInit(): void {
    this.sub = this.sharedS.ann.subscribe(annonces => this.annonces = annonces);
    console.log(this.annonces);
  }

}
