import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PostsService } from '../../posts.services';
import { MatDialogRef, MatSnackBar } from '@angular/material';

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

  @Input() postsService: PostsService;

  @Input() isNewMachine: any;
  @Input() machineName: string;
  countInput: number;
  defaultMinutesInput: number;
  minMinutesInput: number;
  maxMinutesInput: number;
  useOptionsInput: boolean;
  useAlertsInput: boolean;
  minuteOptionsInput: any[] = [];
  alertOptionsInput: any[] = [];
  iconInput: string;
  emailSubjectInput: string;
  emailTextInput: string;

  optionsCount: number;
  alertsCount: number;

  counterCount: number;

  @Output()
  completed = new EventEmitter<string>();

  constructor(public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    if (this.isNewMachine === undefined || this.isNewMachine === 'false') {
      this.isNewMachine = false;
    } else {
      // initializes some variables when creating a new machine
      this.machineName = 'New Machine';
      this.useAlertsInput = false;
      this.useOptionsInput = false;
    }
    if (this.config && this.isNewMachine === false) {
      const machine = this.config.Machines.List[this.machineName];
      if (machine) {
       if (machine.minuteOptions) {
         this.optionsCount = machine.minuteOptions.length;
       }
       if (machine.customAlerts) {
         this.alertsCount = machine.customAlerts.length;
       }
      }
    }

    if (this.optionsCount < 10) { // fixes minute options since it's not long enough
      for (let i = 0; i < 10 - this.optionsCount; i++) {
        this.minuteOptionsInput.push({});
      }
    }

    if (this.alertsCount < 10) { // fixes alert options since it's not long enough
      for (let i = 0; i < 10 - this.alertsCount; i++) {
        this.alertOptionsInput.push({
          'email': {}
        });
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
      this.useAlertsInput = newMachine.useAlerts;

      this.iconInput = newMachine.icon;
      this.emailSubjectInput = newMachine.email.subject;
      this.emailTextInput = newMachine.email.text;

      if (newMachine.minuteOptions) {
        this.minuteOptionsInput = newMachine.minuteOptions.slice();
      }

      if (newMachine.alertOptions) {
        this.alertOptionsInput = newMachine.alertOptions.slice();
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

  alertsCountChange() {
    if (this.alertsCount > this.alertOptionsInput.length) { // fixes alert options since it's not long enough
      for (let i = 0; i < this.alertsCount - this.alertOptionsInput.length; i++) {
        this.alertOptionsInput.push({
          'email': {}
        });
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
      this.useAlertsInput = machine.useAlerts;

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

      if (this.useAlertsInput) {
        const newAlertOptions = [];
        for (let i = 0; i < this.alertsCount; i++) {
          newAlertOptions.push(JSON.parse(JSON.stringify(machine.customAlerts[i])));
        }
        this.alertOptionsInput = newAlertOptions;
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
    newMachine.useAlerts = this.useAlertsInput;
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

    if (this.useAlertsInput) {
      const newAlertOptions = [];
      newMachine.customAlerts = [];
      for (let i = 0; i < this.alertsCount; i++) {
        newAlertOptions.push(JSON.parse(JSON.stringify(this.alertOptionsInput[i])));
      }
      newMachine.customAlerts = newAlertOptions;
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
    let requiredsEmpty = !this.countInput || !this.defaultMinutesInput || !this.minMinutesInput;
    if (this.useOptionsInput) {
      for (let i = 0; i < this.optionsCount; i++) {
        const minuteOption = this.minuteOptionsInput[i];
        if (!minuteOption.key || !minuteOption.label || !minuteOption.amount) {
          requiredsEmpty = true;
        }
      }
    }

    if (this.useAlertsInput) {
      for (let i = 0; i < this.alertsCount; i++) {
        const alertOption = this.alertOptionsInput[i];
        if (!alertOption.key || !alertOption.email.subject || !alertOption.email.text) {
          requiredsEmpty = true;
        }
      }
    }

    return machineAlreadyExists || requiredsEmpty;
  }

  onSaveMachine(): any {
    this.setConfig();
    if (this.isNewMachine) {
      this.completed.emit('completed');
      const snackBarRef = this.snackBar.open('Successfully added machine. You may have to reload to see changes.', 'Close', {
        duration: 3000
      });
    } else {
      const snackBarRef = this.snackBar.open('Successfully saved machine. You may have to reload to see changes.', 'Close', {
        duration: 3000
      });
    }
  }

  checkSettingsSame(): boolean {
    const newConfig = this.createConfig();
    return JSON.stringify(newConfig) === JSON.stringify(this.configValue);
  }

  incrementAlertsCount() {
    this.alertsCount++;
    this.alertsCountChange();
  }

  decrementAlertsCount() {
    this.alertsCount--;
    this.alertsCountChange();
  }

  incrementOptionsCount() {
    this.optionsCount++;
    this.optionsCountChange();
  }

  decrementOptionsCount() {
    this.optionsCount--;
    this.optionsCountChange();
  }

  counter(count) {
    const countArray = [];
    for (let i = 0; i < count; i ++) {
      countArray.push(i);
    }
    return countArray;
  }
}
