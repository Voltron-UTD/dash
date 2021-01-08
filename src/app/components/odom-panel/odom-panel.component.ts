import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BridgeService } from 'src/app/services/bridge-service.service';

@Component({
  selector: 'app-odom-panel',
  templateUrl: './odom-panel.component.html',
  styleUrls: ['./odom-panel.component.css']
})
export class OdomPanelComponent implements OnInit {

  throttlePct: number = 0;
  brakePct: number = 0;
  canSteerEffort: number = 0;

  constructor(public bridgeServ: BridgeService) {

  }

  ngOnInit(): void {
    this.bridgeServ.throttleEffort.subscribe((throttle)=> {
      this.throttlePct = throttle*100;
    })
    this.bridgeServ.brakeEffort.subscribe((brake)=> {
      this.brakePct = brake*100;
    })
    this.bridgeServ.steerEffort.subscribe((steer) => {
      this.canSteerEffort = steer;
    })
  }

  get brakePct$(): Observable<number> {
    return this.bridgeServ.brakeEffort
  }

  get totalTbString(): string {
    if (this.throttlePct == this.brakePct)
      return "0%"
    else if (this.throttlePct > this.brakePct)
      return "+"+Math.round(this.throttlePct)+"%"
    else return "-"+Math.round(this.brakePct)+"%"
  }

  get leftSteeringPct(): number {
    return Math.min(0, this.canSteerEffort)*-100;
  }

  get rightSteeringPct(): number {
    return Math.max(0, this.canSteerEffort)*100;
  }

  get totalSteeringString(): string {
    return Math.round(this.canSteerEffort*100)+"%";
  }

}
