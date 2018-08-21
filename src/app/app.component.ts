import { Component, OnInit } from '@angular/core';
import { PostsService } from './posts.services';
import { Brother } from './components/brothers-queue/brothers-queue.component';
import {Observable} from 'rxjs/Rx';
import MACHINES_LIST from './utils/consts';
import { MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PostsService]
})

export class AppComponent {
  title = 'app';
  name: string;
  queue: any[];
  machine: string;
  machineAvailability: object = null;
  selectedIndex: any;
  topBarTitle: string;
  hasQueue = false;
  useQueue = true;
  isDev = false;
  devPath = 'http://localhost:8088/';
  mobile: boolean;

  // danny: Brother = new Brother('Danny Brandsdorfer', 10.2);
  // jeremy: Brother = new Brother('Jeremy Winter', 20.6);

  // tempBros: Brother[] = [this.danny, this.jeremy];

  constructor(private postsService: PostsService, ) { // init for the beginning of the app
    const queueType = 'both';

    if (this.isDev) {
      this.postsService.path = this.devPath;

        this.postsService.getList(queueType, false).subscribe(res => {
          this.queue = this.queueResponseToQueue(res.list);
          this.queueReached();
        });
    } else {
      this.postsService.getConfig().subscribe(result => { // loads settings
        this.topBarTitle = result.ZetaWash.Extra.titleTop;
        this.useQueue = result.ZetaWash.Machines.useQueue;

        this.postsService.path = result.ZetaWash.Host.backendURL;

        this.postsService.getList(queueType, false).subscribe(res => {
          this.queue = this.queueResponseToQueue(res.list);
          this.queueReached();
        });
      },
      error => {
        console.log(error);
      });
    }
  }


  queueReached() {
    this.hasQueue = true;
    this.machineAvailability = {};
    for (const machine in MACHINES_LIST) {
      if (machine !== null) {
        this.machineAvailability[machine] = null;
      }
    }
    this.checkMachinesForAvailability();
  }

  ngOnInit() {
    // creates timer for checking times
    const timer = Observable.timer(0, 1000);
    timer.subscribe(t => {
      const queueType = 'both';
      this.postsService.getList(queueType, false).subscribe(res => {
        this.queue = this.queueResponseToQueue(res.list);
      });
      if (this.hasQueue) {
        this.checkQueue();
        this.checkMachinesForAvailability();
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
    if (this.queue) {
      for (let i = 0; i < this.queue.length; i++) {
        const queueObj = this.queue[i];
        if (queueObj.endTime < Math.floor(Date.now() / 1000)) {
          this.queue.splice(i, 1);  // deletes item locally if the time is over
        }
      }
    }
  }

  checkMachinesForAvailability() {
    for (const machine in MACHINES_LIST) {
      if (machine !== null) {
        const machine_count = MACHINES_LIST[machine]['count'];
        const machinesInUse = this.getMachineCountInUse(this.queue, machine);
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
  }

  getMachineCountInUse(queue, machine: string) {
    let machineCount = 0;
    queue.forEach(element => {
      if (element.machine === machine) {
        machineCount++;
      }
    });
    return machineCount;
  }


  onNotifyMachine(machine: string) {
    this.machine = machine;
  }



}
