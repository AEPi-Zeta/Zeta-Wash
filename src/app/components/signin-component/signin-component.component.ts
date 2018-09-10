import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';
import {PostsService} from '../../posts.services';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgForm
} from '@angular/forms';

@Component({
  selector: 'app-signin-component',
  templateUrl: './signin-component.component.html',
  styleUrls: ['./signin-component.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponentComponent implements OnChanges {
  minutes: number;
  buttonDisable: boolean;
  name: string;
  isOnlyQueue = true;
  selected: any;
  mobile: boolean;
  autoQueue: boolean = true;

  @Input() queue: any[];
  @Input() list: any[];

  @Input() machine: string;
  @Output() machineChange = new EventEmitter<string>();
  @Input() MACHINES_LIST: any;

  @Input() machineAvailability: any;

  constructor(private postsService: PostsService, ) {
    this.minutes = 30;
    this.buttonDisable = false;
  }

  @ViewChild(NgForm) signinForm: NgForm;

  ngOnInit() {
    if (window.screen.width < 360) { // 768px portrait
      this.mobile = true;
    }
  }

  addToList(queueObj, isOnlyQueue) {
    this.postsService.addToList(queueObj, isOnlyQueue)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;

        if (didSucceed) {
          this.handleAddToListSuccess(queueObj, uniqueID, isOnlyQueue);
          if (this.autoQueue && !isOnlyQueue && queueObj['machine'] === 'washer') {
            const queueBrotherObject = res.listObj;
            queueBrotherObject['machine'] = 'dryer';
            this.postsService.addToList(queueBrotherObject, true)
              .subscribe(res2 => {
                console.log('Auto added to queue successfully.');
              });
          }
        } else {
          this.handleAddToListFailure(queueObj);
        }
      },
      err => {
        this.handleAddToListFailure(queueObj);
      });
  }

  onSubmitSignin() {
    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;

    if (!this.isOnlyQueue) {
      endTime = startTime + this.minutes * 60;
    } else {
      endTime = null;
    }

    const queueObj = {
      name: this.name,
      machine: this.machine.toLowerCase(),
      startTime: startTime,
      endTime: endTime,
      minutes: this.minutes,
      uniqueID: '',
    };

    this.addToList(queueObj, this.isOnlyQueue);
  }

  handleAddToListSuccess(queueObj, uniqueID, isOnlyQueue) {
    queueObj['uniqueID'] = uniqueID;

    if (!isOnlyQueue) {
      this.list.push(queueObj);
    } else {
      this.queue.push(queueObj);
    }

    this.resetSignInForm();
  }

  handleAddToListFailure(queueObj) {
    // this.buttonDisable = false;
  }

  resetSignInForm() {
    this.signinForm.resetForm();
  }

  onMachineChange() {
    if (this.machine && this.machine.length > 0 && this.machineAvailability && this.machineAvailability[this.machine.toLowerCase()]) {
      this.isOnlyQueue = false;
    } else if (this.machine && this.machine.length > 0
      && this.machineAvailability && !this.machineAvailability[this.machine.toLowerCase()]) {
        this.isOnlyQueue = true;
    }
  }

  ngOnChanges(changes) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'machine') {
          const change = changes[propName];
          const curVal  = change.currentValue;
          const prevVal = change.previousValue;
          if (curVal) {
            this.machineChange.emit(curVal);
            this.minutes = this.MACHINES_LIST[curVal.toLowerCase()]['default_minutes'];
          }
        }
      }
    }

    if (changes['machineAvailability']) {
      this.machineAvailability = this.machineAvailability;
      if (this.machineAvailability && this.machineAvailability.washer && this.machineAvailability.dryer) {
        this.isOnlyQueue = false;
      }
    }
  }

}
