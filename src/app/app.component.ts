import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { PostsService } from './posts.services';
import { Brother } from './components/brothers-queue/brothers-list.component';
import {Observable} from 'rxjs/Rx';
// import MACHINES_LIST from './utils/consts';
import { MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR } from '@angular/material';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PostsService]
})

export class AppComponent {
  title = 'app';
  name: string;
  list: any[];
  queue: any[];
  machine: string;
  machineAvailability: object = null;
  selectedIndex: any;
  topBarTitle: string;
  hasList = false;
  useQueue = true;
  isDev = true;
  devPath = 'http://localhost:8088/';
  mobile: boolean;
  isFullScreen = false;
  MACHINES_LIST: any;
  users: any[] = [];

  // danny: Brother = new Brother('Danny Brandsdorfer', 10.2);
  // jeremy: Brother = new Brother('Jeremy Winter', 20.6);

  // tempBros: Brother[] = [this.danny, this.jeremy];

  constructor(public postsService: PostsService, ) { // init for the beginning of the app
    const queueType = 'both';
    this.postsService.getConfig(this.isDev).subscribe(result => { // loads settings
      this.topBarTitle = result.ZetaWash.Extra.titleTop;
      this.useQueue = result.ZetaWash.Machines.useQueue;

      this.postsService.path = result.ZetaWash.Host.backendURL;

      this.MACHINES_LIST = result.ZetaWash.Machines.List;

      this.postsService.getList(queueType).subscribe(res => {
        this.list = this.queueResponseToQueue(res.fullList.list);
        this.queue = this.queueResponseToQueue(res.fullList.queue);

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
        this.listReached();
      });

      if (result.ZetaWash.Users.customUsersList) {
        this.postsService.getUsers().subscribe(res => {
          this.users = res.users;
        });
      }
    },
    error => {
      console.log(error);
    });
  }


  listReached() {
    this.hasList = true;
    this.machineAvailability = {};
    this.machineAvailability['washers'] = [];
    for (let i = 0; i < this.MACHINES_LIST['washer']['count']; i++) {
      this.machineAvailability['washers'][i] = {};
      const washer = this.machineAvailability['washers'][i];
      washer['inUse'] = this.checkIfMachineInUse(this.list, 'washer' + (i + 1)); // checks whether it's in use or not
      washer['key'] = 'washer' + (i + 1); // sets the key
      washer['longName'] = 'Washer ' + (i + 1); // sets the long name for the machine
    }

    this.machineAvailability['dryers'] = [];
    for (let i = 0; i < this.MACHINES_LIST['dryer']['count']; i++) {
      this.machineAvailability['dryers'][i] = {};
      const dryer = this.machineAvailability['dryers'][i];
      dryer['inUse'] = this.checkIfMachineInUse(this.list, 'dryer' + (i + 1)); // checks whether it's in use or not
      dryer['key'] = 'dryer' + (i + 1); // sets the key
      dryer['longName'] = 'Dryer ' + (i + 1); // sets the long name for the machine
    }
  }

  ngOnInit() {
    // creates timer for checking times
    const timer = Observable.timer(0, 1000);
    timer.subscribe(t => {
      const queueType = 'both';
      this.postsService.getList(queueType).subscribe(res => {
        this.list = this.queueResponseToQueue(res.fullList.list);
        this.queue = this.queueResponseToQueue(res.fullList.queue);

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
      });
      if (this.hasList) {
        this.checkQueue();
        this.listReached();
      }
    });
  }

  queueResponseToQueue(queueResponse) {
    const newQueueArray = [];
    for (let i = 0; i < queueResponse.length; i++) {
      newQueueArray.push(queueResponse[i].listObj);
    }
    return newQueueArray;
  }

  checkQueue() {
    if (this.list) {
      for (let i = 0; i < this.list.length; i++) {
        const queueObj = this.list[i];
        if (queueObj.endTime < Math.floor(Date.now() / 1000)) {
          this.list.splice(i, 1);  // deletes item locally if the time is over
        }
      }
    }
  }

  /*checkMachinesForAvailability() {
    for (const machine in this.MACHINES_LIST) {
      if (machine !== null) {
        const machine_count = this.MACHINES_LIST[machine]['count'];
        const machinesInUse = this.getMachineCountInUse(this.list, machine);
        if (machinesInUse === machine_count) {
          this.machineAvailability[machine] = false;
        } else if (machinesInUse < machine_count) {
          this.machineAvailability[machine] = true;
        } else {
          console.error('More machines in use than exist!');
          this.machineAvailability[machine] = false;
        }
      }
    }
  }*/

  getMachineCountInUse(queue, machine: string) {
    let machineCount = 0;
    queue.forEach(element => {
      if (element.machine === machine) {
        machineCount++;
      }
    });
    return machineCount;
  }

  checkIfMachineInUse(queue, specificMachine: string) {
    let isInUse = false;
    queue.forEach(element => {
      if (element['machine'] + element['machineNumber'] === specificMachine) {
        isInUse = true;
      }
    });
    return isInUse;
  }


  onNotifyMachine(machine: string) {
    this.machine = machine;
  }

  toggleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document['mozFullScreenElement'] &&
      !document.webkitFullscreenElement && !document['msFullscreenElement']) {
      this.isFullScreen = true;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen']();
      } else if (elem['mozRequestFullScreen']) {
        elem['mozRequestFullScreen']();
      } else if (elem.webkitRequestFullscreen) {
        elem['webkitRequestFullscreen']();
      }
    } else {
      this.isFullScreen = false;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document['msExitFullscreen']) {
        document['msExitFullscreen']();
      } else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
      } else if (document.webkitExitFullscreen) {
        document['webkitExitFullscreen']();
      }
    }
  }

}
