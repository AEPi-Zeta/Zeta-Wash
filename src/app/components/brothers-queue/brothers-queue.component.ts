import { Component, OnInit, Input } from '@angular/core';
import {PostsService} from '../../posts.services';

@Component({
  selector: 'app-brothers-queue',
  templateUrl: './brothers-queue.component.html', 
  styleUrls: ['./brothers-queue.component.css']
})
export class BrothersQueueComponent {

  machine: string;

  @Input() queue: any[];

  public now: number = Math.floor(new Date().getTime() / 1000);

  removeFromQueue(brother) {
    const index = this.queue.indexOf(brother);

    const queueObj = this.queue[index];

    this.postsService.removeFromList(queueObj, false)
      .subscribe(res => {
        this.queue.splice(index, 1);
    });
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

}

export class Brother {
  public name = '';
  public time = 0;

  constructor(name: string, time: number) {
    this.name = name;
    this.time = time;
  }

}
