import { Component, OnInit, Input, SimpleChanges, EventEmitter } from '@angular/core';
import {PostsService} from '../../posts.services';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent {

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


  removeFromQueue(user) {
    const index = this.queue.indexOf(user);

    const queueObj = this.queue[index];

    this.postsService.removeFromList(queueObj, true)
      .subscribe(res => {
        this.queue.splice(index, 1);
    });
  }

  removeFromList(user) {
    const index = this.list.indexOf(user);

    const queueObj = this.list[index];

    this.postsService.removeFromList(queueObj, false)
      .subscribe(res => {
        this.list.splice(index, 1);
    });
  }

  moveFromQueueToList(user) {
    const index = this.queue.indexOf(user);

    const queueObj = this.queue[index];

    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;
    endTime = startTime + queueObj.minutes * 60;

    queueObj.startTime = startTime;
    queueObj.endTime = endTime;
    this.addToList(queueObj);
    this.removeFromQueue(user);
  }

  addToList(user) {
    this.postsService.addToList(user, false)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;

        if (didSucceed) {
          this.handleAddToListSuccess(user, uniqueID);
        } else {
          this.handleAddToListFailure(user);
        }
      },
      err => {
        this.handleAddToListFailure(user);
      });
  }

  handleAddToListSuccess(user, uniqueID) {
    // console.log('user with unique ID ' + uniqueID + ' added to list.');
  }

  handleAddToListFailure(user) {
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
