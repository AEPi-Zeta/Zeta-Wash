import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

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

  @Input() queue: any[];
  @Input() list: any[];
  @Input() useQueue: boolean;

  @Input() users: any[];
  @Input() forceCustomUsersList;

  @Input() machine: string;
  @Output() machineChange = new EventEmitter<string>();
  @Input() MACHINES_LIST: any;

  @Input() canRemoveFromUsageList: boolean;

  @Input() machineAvailability: any;

  constructor() { }

  ngOnInit() {
  }

}
