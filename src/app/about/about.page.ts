import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false,
  template: `<div id="mapId" class="leaflet-map"></div>`
})
export class AboutPage implements OnInit {
  CompanyMap() {
    this.router.navigate(['company-map']);
  }
  constructor(public router: Router) {
  }

  ngOnInit() {
    
  }
}