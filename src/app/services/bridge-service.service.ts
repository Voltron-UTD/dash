import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BridgeService {
  private ros: any;

  private isConnected$: BehaviorSubject<boolean>;

  // CAN bus subscription topics
  private canSpeedTopic: ROSLIB.Topic;
  private canBrakeTopic: ROSLIB.Topic;
  private canThrottleTopic: ROSLIB.Topic;
  private canSteerTopic: ROSLIB.Topic;

  // Vehicle odom observables
  private canSpeedMps$: BehaviorSubject<number>;
  private throttleEffort$: BehaviorSubject<number>;
  private brakeEffort$: BehaviorSubject<number>;
  private steerEffort$: BehaviorSubject<number>;
  
  private testTopic: ROSLIB.Topic;

  private BRIDGE_ADDRESS: string = "ws://localhost:9090"

  constructor() {
    this.isConnected$ = new BehaviorSubject<boolean>(false);
    
    this.canSpeedMps$ = new BehaviorSubject<number>(0);
    this.throttleEffort$ = new BehaviorSubject<number>(0);
    this.brakeEffort$ = new BehaviorSubject<number>(0);
    this.steerEffort$ = new BehaviorSubject<number>(0);
    
    this.ros = new ROSLIB.Ros({});
    
    // Create a test topic for debugging [TODO: remove test]
    this.testTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/testTopic',
      messageType: 'std_msgs/msg/String'
    });

    // Create a CAN Bus topic (state_report)
    this.canSpeedTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/luna/can/speed_mps',
      messageType: 'std_msgs/msg/Float32'
    })
    this.canThrottleTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/luna/can/throttle_effort',
      messageType: 'std_msgs/msg/Float32'
    })
    this.canBrakeTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/luna/can/brake_effort',
      messageType: 'std_msgs/msg/Float32'
    })
    this.canSteerTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/luna/can/steer_effort',
      messageType: 'std_msgs/msg/Float32'
    })
    
  }

  initialize() {
    // Let's create a connection to the ROS Web Bridge

    this.ros.on('error', function (error: any) {
      console.log(error);
    });

    this.ros.on('connection', () => {
      this.isConnected$.next(true);

      this.testTopic.subscribe((message: any)=> {
        console.log(message);
      })

      this.canSpeedTopic.subscribe((message: any) => {
        this.canSpeedMps$.next(message.data)
      })
      this.canThrottleTopic.subscribe((message: any) => {
        this.throttleEffort$.next(message.data)
      })
      this.canBrakeTopic.subscribe((message: any) => {
        this.brakeEffort$.next(message.data)
      })
      this.canSteerTopic.subscribe((message: any) => {
        this.steerEffort$.next(message.data)
      })
    });

    this.ros.on('close', () => {
      this.isConnected$.next(false);
    });

    // Subscribe to connection changes
    this.isConnected$.subscribe(
      (connected) => {
        // if (!connected) {
        //   this.retryConnectionEndlessly(20000);
        // }
      },
      () => {},
      () => {}
    );

    //Finally, connect
    this.ros.connect(this.BRIDGE_ADDRESS);
  }

  publishToTestTopic(msgString: string) {
    let msg = new ROSLIB.Message({
      data: msgString
    });
    this.testTopic.publish(msg);
  }

  retryConnectionEndlessly(delay: number) {
    this.ros.connect(this.BRIDGE_ADDRESS);
    setTimeout(() => {
      // Retry if not connected
      if (!this.isConnected$.value) {
        console.error('[Bridge Serv] Connection failed, retrying.');
        this.retryConnectionEndlessly(delay);
      }
    }, delay);
  }

  connectionMade(): void {
    console.log('A new connection was established.');

    this.isConnected$.next(true);
  }

  // get vehicleState(): Observable<Object> {

  // }

  get isConnected(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  get canSpeedMps(): Observable<number> {
    return this.canSpeedMps$.asObservable();
  }

  get throttleEffort(): Observable<number> {
    return this.throttleEffort$.asObservable();
  }

  get brakeEffort(): Observable<number> {
    return this.brakeEffort$.asObservable();
  }

  get steerEffort(): Observable<number> {
    return this.steerEffort$.asObservable();
  }
}
