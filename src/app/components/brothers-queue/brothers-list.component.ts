import { Component, OnInit, Input, SimpleChanges, EventEmitter } from '@angular/core';
import {PostsService} from '../../posts.services';

@Component({
  selector: 'app-brothers-list',
  templateUrl: './brothers-list.component.html',
  styleUrls: ['./brothers-list.component.css']
})
export class BrothersListComponent {

  machine: string;

  @Input() queue: any[];
  @Input() list: any[];

  @Input() machineAvailability: any;

  @Input() usingListOnly ? = false; // optional parameter for having only the usingList available

  public now: number = Math.floor(new Date().getTime() / 1000);


  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['machineAvailability']) {
        this.machineAvailability = this.machineAvailability;
    }
  }


  removeFromQueue(brother) {
    const index = this.queue.indexOf(brother);

    const queueObj = this.queue[index];

    this.postsService.removeFromList(queueObj, true)
      .subscribe(res => {
        this.queue.splice(index, 1);
    });
  }

  removeFromList(brother) {
    const index = this.list.indexOf(brother);

    const queueObj = this.list[index];

    this.postsService.removeFromList(queueObj, false)
      .subscribe(res => {
        this.list.splice(index, 1);
    });
  }

  moveFromQueueToList(brother) {
    const index = this.queue.indexOf(brother);

    const queueObj = this.queue[index];

    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;
    endTime = startTime + queueObj.minutes * 60;

    queueObj.startTime = startTime;
    queueObj.endTime = endTime;
    this.addToList(queueObj);
    this.removeFromQueue(brother);
  }

  addToList(brother) {
    this.postsService.addToList(brother, false)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;

        if (didSucceed) {
          this.handleAddToListSuccess(brother, uniqueID);
        } else {
          this.handleAddToListFailure(brother);
        }
      },
      err => {
        this.handleAddToListFailure(brother);
      });
  }

  handleAddToListSuccess(brother, uniqueID) {
    // console.log('Brother with unique ID ' + uniqueID + ' added to list.');
  }

  handleAddToListFailure(brother) {
    // TODO: MAKE DO SOMETHING
  }

  constructor(private postsService: PostsService) {
    setInterval(() => {
      this.now = Math.floor(new Date().getTime() / 1000);
    }, 1);
  }

  SecondsTohhmmss(totalSeconds) {
    if (totalSeconds > 0) {
      let hours = Math.floor(totalSeconds / 3600).toString();
      let minutes = Math.floor((totalSeconds % 3600) / 60).toString();
      let seconds = Math.floor(totalSeconds % 60).toString();

      hours = parseInt(minutes, 10) < 10 ? '0' + hours : hours;
      minutes = parseInt(minutes, 10) < 10 ? '0' + minutes : minutes;
      seconds = parseInt(seconds, 10) < 10 ? '0' + seconds : seconds;

      return hours + ':' + minutes + ':' + seconds;
    } else {
      return '';
    }
  }

  machineToIndex(name) {
    return parseInt(name.substring(name.length - 1, name.length), 10) - 1;
  }

  machineToPlural(name) {
    return name.substring(0, name.length - 1) + 's';
  }

}

export class Brother {
  public name = '';
  public time = 0;

  constructor(name: string, time: number) {
    this.name = name;
    this.time = time;
  }

}
