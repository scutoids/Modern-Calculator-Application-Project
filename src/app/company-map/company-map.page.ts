import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-company-map',
  templateUrl: './company-map.page.html',
  styleUrls: ['./company-map.page.scss'],
  standalone: false, 
})
export class CompanyMapPage implements OnInit {
  private map: L.Map;
  constructor() {
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    // Create map after view init
    this.map = L.map('div_map').setView([22.421221656600338, 114.23139368650743], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions:'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom:18, minZoom:8
      }).addTo(this.map);

    L.marker([22.421221656600338, 114.23139368650743], 18)
    const markerGroup=L.featureGroup();
    markerGroup.addLayer(L.marker([22.421221656600338, 114.23139368650743], 18));
    this.map.addLayer(markerGroup);
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
