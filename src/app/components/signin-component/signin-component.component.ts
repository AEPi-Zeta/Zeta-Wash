import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import {PostsService} from '../../posts.services';
import { Brother } from '../brothers-queue/brothers-queue.component';
import MACHINES_LIST from './../../utils/consts';
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
  styleUrls: ['./signin-component.component.css']
})
export class SigninComponentComponent implements OnChanges {
  minutes: number;
  buttonDisable: boolean;
  name: string;
  isOnlyQueue: boolean;
  selected: any;
  mobile: boolean;

  @Input() queue: any[];
  @Input() machine: string;
  @Output() machineChange = new EventEmitter<string>();

  constructor(private postsService: PostsService, ) {
    this.minutes = 30;
    this.buttonDisable = false;
  }

  @ViewChild(NgForm) signinForm: NgForm;

  ngOnInit() {
    if (window.screen.width < 360) { // 768px portrait
      this.mobile = true;
      console.log('oh yeah');
    }
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
      uniqueID: '',
    };

    this.postsService.addToList(queueObj, false)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;

        if (didSucceed) {
          this.handleAddToListSuccess(queueObj, uniqueID);
        } else {
          this.handleAddToListFailure(queueObj);
        }
      },
      err => {
        this.handleAddToListFailure(queueObj);
      });
  }

  handleAddToListSuccess(queueObj, uniqueID) {
    queueObj['uniqueID'] = uniqueID;
    this.queue.push(queueObj);
    this.resetSignInForm();
  }

  handleAddToListFailure(queueObj) {
    // this.buttonDisable = false;
  }

  resetSignInForm() {
    this.signinForm.resetForm();
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
            this.minutes = MACHINES_LIST[curVal.toLowerCase()]['default_minutes'];
          }
        }
      }
    }
  }

}
