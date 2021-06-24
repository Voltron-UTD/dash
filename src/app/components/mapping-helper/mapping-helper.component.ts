import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClarityIcons, cogIcon } from '@cds/core/icon';
import '@cds/core/icon/register.js';
import { ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapping-helper',
  templateUrl: './mapping-helper.component.html',
  styleUrls: ['./mapping-helper.component.css']
})
export class MappingHelperComponent implements AfterViewInit {
  private map: any;
  zoneStepState: ClrTimelineStepState;
  originStepState: ClrTimelineStepState;
  pcdStepState: ClrTimelineStepState;

  constructor() { 
    ClarityIcons.addIcons(cogIcon)
    this.zoneStepState = ClrTimelineStepState.CURRENT;
    this.originStepState = ClrTimelineStepState.NOT_STARTED;
    this.pcdStepState = ClrTimelineStepState.NOT_STARTED;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [32.9865279, -96.7486954],
      zoom: 15
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  finishZoneSelect(): void {
    console.log(this.map.getBounds())
  }

}
