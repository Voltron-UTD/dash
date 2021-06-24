import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClarityIcons, cogIcon } from '@cds/core/icon';
import '@cds/core/icon/register.js';
import '@cds/core/file/register.js';
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
  mapFrozen: boolean;
  canProgress: boolean = true;
  
  origin: L.LatLng | undefined;
  originMarker: L.Marker | undefined;
  
  constructor() { 
    ClarityIcons.addIcons(cogIcon)
    this.zoneStepState = ClrTimelineStepState.CURRENT;
    this.originStepState = ClrTimelineStepState.NOT_STARTED;
    this.pcdStepState = ClrTimelineStepState.NOT_STARTED;
    this.mapFrozen = false;
  }
  
  public get mapCursor(): string {
    if(this.originStepState === ClrTimelineStepState.CURRENT) {
      return "cell"
    } else {
      return ""
    }
  }
  
  public isCurrent(state: ClrTimelineStepState): boolean {
    return state === ClrTimelineStepState.CURRENT;
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
  
  this.map.on('click', (e: any)=> {
    this.mapClicked(e);
  })
}

setMapOrigin(point: L.LatLng): void {
  if (this.originMarker === undefined) {
    this.originMarker = L.marker(point).addTo(this.map);
  } else {
    this.originMarker.remove();
    this.originMarker = L.marker(point).addTo(this.map);
  }
  
  this.origin = point;
}

public mapClicked(e: L.LeafletMouseEvent): void {
  console.log(e);
  
  if (this.isCurrent(this.originStepState)) {
    this.setMapOrigin(e.latlng);
  }
}

nextClicked(): void {
  if (this.zoneStepState === ClrTimelineStepState.CURRENT) {
    console.log(this.map.getBounds())
    this.zoneStepState = ClrTimelineStepState.SUCCESS;
    this.originStepState = ClrTimelineStepState.CURRENT;
    this.mapFrozen = true;
  } else if (this.originStepState === ClrTimelineStepState.CURRENT) {
    this.originStepState = ClrTimelineStepState.SUCCESS;
    this.pcdStepState = ClrTimelineStepState.CURRENT;
    this.canProgress = false;
  }
  
}

}
