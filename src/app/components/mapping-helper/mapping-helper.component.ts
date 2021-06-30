import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClarityIcons, cogIcon, pictureIcon } from '@cds/core/icon';
import '@cds/core/icon/register.js';
import '@cds/core/file/register.js';
import { ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GridLayer } from 'leaflet';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-mapping-helper',
  templateUrl: './mapping-helper.component.html',
  styleUrls: ['./mapping-helper.component.css'],
})

export class MappingHelperComponent implements AfterViewInit {
  private map: any | L.Map;
  zoneStepState: ClrTimelineStepState;
  originStepState: ClrTimelineStepState;
  pcdStepState: ClrTimelineStepState;
  alignStepState: ClrTimelineStepState;
  mapFrozen: boolean;
  canProgress: boolean = true;

  uploadedFiles: any | FileList;
  pcdText: string = '';
  pcdDetailLevel: number = 10;
  pcdRotation: number = 0; //degrees
  pcdXOffset: number = 0; //meters
  pcdYOffset: number = 0; //meters
  pcdXStretch: number = 100;
  pcdYStretch: number = 100;
  pcdMarkers: L.CircleMarker[] = [];
  latlngs: L.LatLng[] = [];

  origin: L.LatLng = L.latLng(-1,-1); //init to bogus number
  originMarker: L.Marker | undefined;
  jsonLayer: L.GeoJSON = new L.GeoJSON();

  constructor(private http: HttpClient) {
    ClarityIcons.addIcons(cogIcon);
    this.zoneStepState = ClrTimelineStepState.CURRENT;
    this.originStepState = ClrTimelineStepState.NOT_STARTED;
    this.pcdStepState = ClrTimelineStepState.NOT_STARTED;
    this.alignStepState = ClrTimelineStepState.NOT_STARTED;
    this.mapFrozen = false;
  }

  public get mapCursor(): string {
    if (this.originStepState === ClrTimelineStepState.CURRENT) {
      return 'cell';
    } else {
      return '';
    }
  }

  public get mapBoundaryString(): string {
    if (this.map) return this.map.getBounds().toBBoxString();
    else return 'unset';
  }

  public isCurrent(state: ClrTimelineStepState): boolean {
    return state === ClrTimelineStepState.CURRENT;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  public addMarkers(map: L.Map, points: L.LatLng[]) {
    for (const point of points) {
      if (Math.random() < (this.pcdDetailLevel/600)) {
        // rotate the point
        let newPoint = this.rotateLatLng(point, this.pcdRotation, this.origin);

        let origin_lat = this.origin.lat*2*Math.PI/360
        let degrees_lat_per_meter = 1/(111132.92-559.82*Math.cos(2*origin_lat)+1.175*Math.cos(4*origin_lat)-0.0023*Math.cos(6*origin_lat));
        let degrees_lng_per_meter = 1/(111412.84*Math.cos(origin_lat)-93.5*Math.cos(3*origin_lat)+0.118*Math.cos(5*origin_lat));
        //apply offset
        newPoint.lng += this.pcdXOffset * degrees_lng_per_meter;
        newPoint.lat += this.pcdYOffset * degrees_lat_per_meter;

        // apply stretch
        newPoint.lng = ((newPoint.lng - this.origin.lng)*(this.pcdXStretch/100))+this.origin.lng;
        newPoint.lat = ((newPoint.lat - this.origin.lat)*(this.pcdXStretch/100))+this.origin.lat;
        

        // create a marker for the point and add it
        const marker = L.circleMarker(newPoint, {
          radius: 2
        });
        this.pcdMarkers.push(marker);
        marker.addTo(map);
      }
      // const marker = new L.Marker([point.lat, point.lng],
      //   {
      //     icon: new L.Icon
      //   }
      // );
      this.canProgress = true;
    }
  }

  private rotateLatLng(point: L.LatLng, angle: number, pivot: L.LatLng) {
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    point.lng -= pivot.lng;
    point.lat -= pivot.lat;

    let lngNew = point.lng * c - point.lat * s;
    let latNew = point.lng * s + point.lat * c;

    point.lng = lngNew + pivot.lng;
    point.lat = latNew + pivot.lat;

    return point;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [32.9865279, -96.7486954],
      zoom: 15,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
    this.map.addLayer(this.jsonLayer);

    this.map.on('click', (e: any) => {
      this.mapClicked(e);
    });
  }

  setMapOrigin(point: L.LatLng): void {
    if (this.originMarker === undefined) {
      this.originMarker = L.marker(point).addTo(this.map);
    } else {
      this.originMarker.remove();
      this.originMarker = L.marker(point).addTo(this.map);
    }

    this.origin = point;
    this.canProgress = true;
  }

  public mapClicked(e: L.LeafletMouseEvent): void {
    console.log(e);

    if (this.isCurrent(this.originStepState)) {
      this.setMapOrigin(e.latlng);
    }

    // var geojson = 
    //   {
    //     type: "Feature",
    //     geometry: {
    //       type: "Point",
    //       coordinates: [e.latlng.lat, e.latlng.lng]
    //     },
    //     properties: {} // Not optional for a Feature
    //   }

    //this.addMarkers(this.map, [e.latlng]);
  }

  public freezeMap(): void {
    this.mapFrozen = true;
  }

  fileChange(element: any) {
    this.uploadedFiles = element.target.files;
    console.log(this.uploadedFiles);
  }

  get canUpload(): boolean {
    if (this.uploadedFiles) return this.uploadedFiles.length > 0;
    else return false;
  }

  uploadPcdFile(): void {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append(
        'uploads[]',
        this.uploadedFiles[i],
        this.uploadedFiles[i].name
      );
    }
    this.http.post('/api/pcd-upload', formData).subscribe((response) => {
      console.log('response received is ', response);
    });
  }

  public pasteFromClipboard(): void {
    navigator.clipboard.readText().then((clipText) => {
      this.pcdText = clipText;
      //console.log(this.pcdText);
      this.processPcdText(this.pcdText);
    });
  }

  public getLatLngPoint(x: number, y: number, lat_per_m: number, lng_per_m: number): L.LatLng {
    let lat = this.origin.lat+y*lat_per_m;
    let lng = this.origin.lng+x*lng_per_m;
    //console.log(y+", "+lat_per_m);
    return L.latLng(lat, lng);
  }

  // TODO: Fix all of this to adapt to different PCD configs (e.g. different fields)
  public processPcdText(data: string): void {
    let substrings: string[] = data.split(/\r?\n/).splice(11);

    // Calculate the precise lat-lon to x-y conversion relative to
    // the origin. See https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree
    let origin_lat = this.origin.lat*2*Math.PI/360
    let degrees_lat_per_meter = 1/(111132.92-559.82*Math.cos(2*origin_lat)+1.175*Math.cos(4*origin_lat)-0.0023*Math.cos(6*origin_lat));
    let degrees_lng_per_meter = 1/(111412.84*Math.cos(origin_lat)-93.5*Math.cos(3*origin_lat)+0.118*Math.cos(5*origin_lat));
    // console.log(degrees_lng_per_meter);
    // console.log(substrings);

    for(var pointstr of substrings) {
      let elems: string[] = pointstr.split(' ');
      // console.log(pointstr);
      if (elems.length===4){
        let latlng = this.getLatLngPoint(parseFloat(elems[0]),parseFloat(elems[1]),degrees_lat_per_meter, degrees_lng_per_meter);
        this.latlngs.push(latlng);
      }
    }

    this.addMarkers(this.map, this.latlngs);

   
  }

  nextClicked(): void {
    if (this.zoneStepState === ClrTimelineStepState.CURRENT) {
      console.log(this.map.getBounds());
      this.zoneStepState = ClrTimelineStepState.SUCCESS;
      this.originStepState = ClrTimelineStepState.CURRENT;
      this.freezeMap();
      this.canProgress = false;
    } else if (this.originStepState === ClrTimelineStepState.CURRENT) {
      this.originStepState = ClrTimelineStepState.SUCCESS;
      this.pcdStepState = ClrTimelineStepState.CURRENT;
      this.canProgress = false;
    } else if (this.pcdStepState === ClrTimelineStepState.CURRENT) {
      this.pcdStepState = ClrTimelineStepState.SUCCESS;
      this.alignStepState = ClrTimelineStepState.CURRENT;
      this.canProgress=false;
    }
  }

  public refreshMap(): void {
    for(const marker of this.pcdMarkers) {
      (this.map as L.Map).removeLayer(marker)
    }
    this.addMarkers(this.map, this.latlngs);
    
  }

}

class DebugCoords extends L.GridLayer {
  public createTile (coords: L.Coords) {
    var tile = document.createElement('canvas');

    var tileSize = this.getTileSize();
    tile.setAttribute('width', tileSize.x.toString());
    tile.setAttribute('height', tileSize.y.toString());

    var ctx = tile.getContext('2d');

    // Draw whatever is needed in the canvas context
    // For example, circles which get bigger as we zoom in
    if (ctx !== null) {
      ctx.beginPath();
      ctx.arc(tileSize.x/2, tileSize.x/2, 4 + coords.z*4, 0, 2*Math.PI, false);
      ctx.fill();

      
    }
    return tile;
  }
}
