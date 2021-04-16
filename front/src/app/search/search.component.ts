import { Component, OnInit } from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';

@Component({
  selector: 'app-main-result',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  items: GalleryItem[] = [];
  data = [
    {
      srcUrl: './assets/images/1.jpg',
      previewUrl: './assets/images/1.jpg'
    },
    {
      srcUrl: './assets/images/2.jpg',
      previewUrl: './assets/images/2.jpg'
    },
    {
      srcUrl: './assets/images/3.jpg',
      previewUrl: './assets/images/3.jpg'
    },
    {
      srcUrl: './assets/images/4.jpg',
      previewUrl: './assets/images/4.jpg'
    },
    {
      srcUrl: './assets/images/5.jpg',
      previewUrl: './assets/images/5.jpg'
    }
  ];
  constructor(private gallery: Gallery) { }

  ngOnInit(): void {
    this.items = this.data.map(item =>
      new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );
    this.gallery.ref().load(this.items);
  }

  }
