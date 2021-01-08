import { Component, OnInit } from '@angular/core';
import { BridgeService } from './services/bridge-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'vt-dash';

  bridgeConnected: boolean = false;

  // sendMessage(): void {

  //   console.log('Connecting to bridge...');

  //   let pubMsg = { 
  //     "op": "publish",
  //     "topic": "/testTopic",
  //     "msg": {
  //       "data": "Hello!"
  //     }
  //   };

  //   let adMessage = { 
  //     "op": "advertise",
  //     "topic": "/testTopic",
  //     "type": "std_msgs/String"
  //   }

  //   const socket: WebSocket = new WebSocket('ws://localhost:9090');
  //   socket.addEventListener('open', function (event) {
  //     socket.send(JSON.stringify(adMessage));
  //     setTimeout( () => {socket.send(JSON.stringify(pubMsg))}, 100);
      
  //   })

  //   socket.addEventListener('message', function(event) {
  //     console.log('Message from server: ', event.data);
  //   })
  // }

  constructor(public bridgeServ: BridgeService) {

  }

  sendMessage() {
    this.bridgeServ.publishToTestTopic("Hello, world!");
  }

  //when the website loads, connect to rosbridge
  ngOnInit() {
    this.bridgeServ.initialize();
    this.bridgeServ.isConnected.subscribe((obs)=>{
      this.bridgeConnected = obs;
    })
  }

}