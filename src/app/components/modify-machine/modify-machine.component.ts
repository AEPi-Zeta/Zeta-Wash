import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PostsService } from '../../posts.services';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modify-machine',
  templateUrl: './modify-machine.component.html',
  styleUrls: ['./modify-machine.component.scss']
})
export class ModifyMachineComponent implements OnInit {

  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.config);
  }

  get config() {
    return this.configValue;
  }

  @Output() configChange = new EventEmitter();

  configValue: any;

  @Input() isNewMachine: any;
  @Input() machineName: string;
  countInput: number;
  defaultMinutesInput: number;
  minMinutesInput: number;
  maxMinutesInput: number;
  useOptionsInput: boolean;
  minuteOptionsInput: any[] = [];
  iconInput: string;
  emailSubjectInput: string;
  emailTextInput: string;

  optionsCount: number;

  counterCount: number;

  @Output()
  completed = new EventEmitter<string>();

  constructor(public postsService: PostsService) {

  }

  ngOnInit() {
    if (this.isNewMachine === undefined || this.isNewMachine === 'false') {
      this.isNewMachine = false;
    } else {
      if (!this.machineName) {
        this.machineName = 'New Machine';
      }
    }
    if (this.config && this.isNewMachine === false) {
      const machine = this.config.Machines.List[this.machineName];
      if (machine) {
       if (machine.minuteOptions) {
         this.optionsCount = machine.minuteOptions.length;
       }
      }
    }

    if (this.optionsCount < 10) { // fixes minute options since it's not long enough
      for (let i = 0; i < 10 - this.optionsCount; i++) {
        this.minuteOptionsInput.push({});
      }
    }

    this.setValuesFromConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isNewMachine) {
      const newConfig = changes.config.currentValue;
      const newMachine = newConfig.Machines.List[this.machineName];
      this.countInput = newMachine.count;
      this.defaultMinutesInput = newMachine.default_minutes;
      this.minMinutesInput = newMachine.min_minutes;
      this.maxMinutesInput = newMachine.max_minutes;
      this.useOptionsInput = newMachine.useOptions;

      this.iconInput = newMachine.icon;
      this.emailSubjectInput = newMachine.email.subject;
      this.emailTextInput = newMachine.email.text;

      if (newMachine.minuteOptions) {
        this.minuteOptionsInput = newMachine.minuteOptions.slice();
      }
    }
  }

  optionsCountChange() {
    if (this.optionsCount > this.minuteOptionsInput.length) { // fixes minute options since it's not long enough
      for (let i = 0; i < this.optionsCount - this.minuteOptionsInput.length; i++) {
        this.minuteOptionsInput.push({});
      }
    }
  }

  setValuesFromConfig() {
    if (!this.isNewMachine) {
      const config = this.config;
      const machine = config.Machines.List[this.machineName];
      this.countInput = machine.count;
      this.defaultMinutesInput = machine.default_minutes;
      this.minMinutesInput = machine.min_minutes;
      this.maxMinutesInput = machine.max_minutes;
      this.useOptionsInput = machine.useOptions;

      this.iconInput = machine.icon;
      this.emailSubjectInput = machine.email.subject;
      this.emailTextInput = machine.email.text;

      if (machine.minuteOptions) {
        const newMinuteOptions = [];
        for (let i = 0; i < machine.minuteOptions.length; i++) {
          newMinuteOptions.push(Object.assign({}, machine.minuteOptions[i]));
        }
        this.minuteOptionsInput = newMinuteOptions;
      }
    }
  }

  createConfig(): any {
    const newConfig = JSON.parse(JSON.stringify(this.configValue));

    // prelimenary stuff for new machine
    if (this.isNewMachine) {
      newConfig.Machines.List[this.machineName] = {};
      newConfig.Machines.List[this.machineName].key = this.machineName;
      newConfig.Machines.List[this.machineName]['email'] = {};
    }
    const newMachine = newConfig.Machines.List[this.machineName];

    newMachine.count = this.countInput;
    newMachine.default_minutes = this.defaultMinutesInput;
    newMachine.min_minutes = this.minMinutesInput;
    newMachine.max_minutes = this.maxMinutesInput;
    newMachine.useOptions = this.useOptionsInput;
    newMachine.icon = this.iconInput;

    newMachine.email.subject = this.emailSubjectInput;
    newMachine.email.text = this.emailTextInput;

    if (this.useOptionsInput) {
      const newMinuteOptions = [];
      newMachine.minuteOptions = [];
      for (let i = 0; i < this.optionsCount; i++) {
        newMinuteOptions.push(Object.assign({}, this.minuteOptionsInput[i]));
      }
      newMachine.minuteOptions = newMinuteOptions;
    }

    return newConfig;
  }

  setConfig(): any {
    const newConfig = this.createConfig();
    this.postsService.setConfig(newConfig).subscribe(res => {
      if (newConfig) {
        this.config = newConfig;
      }
    });
  }

  inputsInvalid(): any {
    const machineAlreadyExists = this.isNewMachine && this.configValue.Machines.List[this.machineName];
    return machineAlreadyExists;
  }

  onSaveMachine(): any {
    this.setConfig();
    if (this.isNewMachine) {
      this.completed.emit('completed');
    }
  }

  checkSettingsSame(): boolean {
    const newConfig = this.createConfig();
    return JSON.stringify(newConfig) === JSON.stringify(this.configValue);
  }

  counter(count) {
    const countArray = [];
    for (let i = 0; i < count; i ++) {
      countArray.push(i);
    }
    return countArray;
  }
}
