import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClarityIcons, cogIcon } from '@cds/core/icon';
import '@cds/core/icon/register.js';
import '@cds/core/file/register.js';
import { ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

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

  uploadedFiles: any | FileList;
  
  origin: L.LatLng | undefined;
  originMarker: L.Marker | undefined;
  
  constructor(private http: HttpClient) { 
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

  public get mapBoundaryString(): string {
    if (this.map)
      return this.map.getBounds().toBBoxString();
    else return "unset"
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

public freezeMap(): void {
  this.mapFrozen = true;
}

fileChange(element: any) {
  this.uploadedFiles = element.target.files;
  console.log(this.uploadedFiles);
}

get canUpload(): boolean {
  if (this.uploadedFiles)
    return this.uploadedFiles.length > 0;
  else return false;
}

uploadPcdFile(): void {
  let formData = new FormData();
  for (var i = 0; i < this.uploadedFiles.length; i++) {
    formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
}
  this.http.post('/api/pcd-upload', formData)
  .subscribe((response) => {
      console.log('response received is ', response);
  })
}

nextClicked(): void {
  if (this.zoneStepState === ClrTimelineStepState.CURRENT) {
    console.log(this.map.getBounds())
    this.zoneStepState = ClrTimelineStepState.SUCCESS;
    this.originStepState = ClrTimelineStepState.CURRENT;
    this.freezeMap();
  } else if (this.originStepState === ClrTimelineStepState.CURRENT) {
    this.originStepState = ClrTimelineStepState.SUCCESS;
    this.pcdStepState = ClrTimelineStepState.CURRENT;
    this.canProgress = false;
  }
  
}

}
