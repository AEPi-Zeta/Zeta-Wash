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
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

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
  // autoQueue = false;
  forceCustom = false;

  objectKeys = Object.keys;

  minuteOptions = [
    {
      'key': '30',
      'amount': 30,
      'label': '30 - Quick'
    },
    {
      'key': '45',
      'amount': 45,
      'label': '60 - Normal'
    },
    {
      'key': '60',
      'amount': 45,
      'label': '80 - Long'
    }
  ];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  @Input() queue: any[];
  @Input() list: any[];
  @Input() useQueue: boolean;

  @Input() users: any[];
  @Input() forceCustomUsersList;

  @Input() machine: string;
  @Output() machineChange = new EventEmitter<string>();
  @Input() MACHINES_LIST: any;
  configValue: any;

  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.config);
  }

  get config() {
    return this.configValue;
  }

  @Output() configChange = new EventEmitter();

  @Input() canRemoveFromUsageList: boolean;

  @Input() machineAvailability: any;

  minutesControl = new FormControl();
  minutesWrong = false;

  machineOld = '';

  constructor(private postsService: PostsService, ) {
    this.minutes = 30;
    this.buttonDisable = false;
  }

  @ViewChild(NgForm) signinForm: NgForm;

  ngOnInit() {
    if (window.screen.width < 360) { // 768px portrait
      this.mobile = true;
    }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  addToList(queueObj, isOnlyQueue) {
    this.postsService.addToList(queueObj, isOnlyQueue)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;

        if (didSucceed) {
          this.handleAddToListSuccess(queueObj, uniqueID, isOnlyQueue);

          /*

          if (this.autoQueue && !isOnlyQueue && queueObj['machine'] === 'washer') {
            const queueUserObject = res.listObj;
            queueUserObject['machine'] = 'dryer';
            this.postsService.addToList(queueUserObject, true)
              .subscribe(res2 => {
                // console.log('Auto added to queue successfully.');
              });
          }

          */

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
      machine: this.machine.substring(0, this.machine.length - 1),
      machineNumber: this.machine.substring(this.machine.length - 1, this.machine.length),
      startTime: startTime,
      endTime: endTime,
      minutes: this.minutes,
      uniqueID: '',
    };

    this.name = ''; // resets name after signin

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

  triggerForceCustom(forceOrNot) {
    this.forceCustom = forceOrNot;
  }

  onMachineChange() {
    let machinePlural;
    let machineIndex;
    if (this.machine) {
      machinePlural = this.machineToPlural(this.machine);
      machineIndex = this.machineToIndex(this.machine);
      if (this.machine.substring(0, this.machine.length - 1) !== this.machineOld) {
        this.minutes = this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)]['default_minutes'];
      }
    }

    if (this.useQueue) {
      if (this.machine && this.machine.length > 0 && this.machineAvailability
        && !this.machineAvailability[machinePlural][machineIndex]['inUse']) {
        this.isOnlyQueue = false;
      } else if (this.machine && this.machine.length > 0
        && this.machineAvailability && this.machineAvailability[machinePlural][machineIndex]['inUse']) {
          this.isOnlyQueue = true;
      }
    } else {
      this.isOnlyQueue = false;
    }

    if (this.machine && this.MACHINES_LIST && this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)]) {
      const machineObj = this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)];

      const minMinutes = machineObj['min_minutes'];
      const maxMinutes = machineObj['max_minutes'];

      // checks if the minutes have exceeded the maximums in the config
      if (minMinutes !== null && maxMinutes !== null) {
        this.minutesControl = new FormControl('', [Validators.max(maxMinutes), Validators.min(minMinutes)]);
      }
    }
    if (this.machine) {
      this.machineOld = this.machine.substring(0, this.machine.length - 1);
    } else {
      this.machineOld = '';
    }
  }

  onMinutesChange() {
    if (this.machine && this.MACHINES_LIST && this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)]) {
      const minMinutes = this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)]['min_minutes'];
      const maxMinutes = this.MACHINES_LIST[this.machine.substring(0, this.machine.length - 1)]['max_minutes'];

      if (this.machine && this.minutes &&
        (this.minutes < minMinutes || this.minutes > maxMinutes || this.minutes < 0 || isNaN(this.minutes))) {
        this.minutesWrong = true;
      } else {
        this.minutesWrong = false;
      }
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
            this.minutes = this.MACHINES_LIST[curVal.substring(0, curVal.length - 1)]['default_minutes'];
            this.onMachineChange();
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(option => option.toLowerCase().includes(filterValue));
  }

  machineToIndex(name) {
    return parseInt(name.substring(name.length - 1, name.length), 10) - 1;
  }

  machineToPlural(name) {
    return name.substring(0, name.length - 1) + 's';
  }

}
