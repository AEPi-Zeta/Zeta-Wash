import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PostsService } from '../../posts.services';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {MatChipsModule, MatChipInputEvent} from '@angular/material/chips';


@Component({
  selector: 'app-modify-machine',
  templateUrl: './modify-machine.component.html',
  styleUrls: ['./modify-machine.component.scss']
})
export class ModifyMachineComponent implements OnInit {
  _allowedMachinesTransferInput: any;

  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.config);
  }

  get config() {
    return this.configValue;
  }

  set allowedMachinesTransferInput(val) {
    console.log('set');
    this._allowedMachinesTransferInput = val;
  }

  get allowedMachinesTransferInput() {
    return this._allowedMachinesTransferInput;
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
  alertServiceInput: string;
  customUsersListInput: boolean;

  // allowedMachinesTransferInput: string[];
  machinesToSelectFrom: string[];

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
       } else {
         this.optionsCount = 0;
       }
       if (machine.customAlerts) {
         this.alertsCount = machine.customAlerts.length;
       } else {
         this.alertsCount = 0;
       }
      }
    }

    this.alertServiceInput = this.config.Users.alertService;
    this.customUsersListInput = this.config.Users.customUsersList;

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
      console.log('ran');
      //this.allowedMachinesTransferInput = JSON.stringnewMachine.allowedMachinesTransfer;

      if (newMachine.minuteOptions) {
        this.minuteOptionsInput = newMachine.minuteOptions.slice();
      }

      if (newMachine.customAlerts) {
        this.alertOptionsInput = newMachine.customAlerts.slice();
      }
    }
  }

  checkOptionsCount() {
    const machine = this.config.Machines.List[this.machineName];
    if (this.useOptionsInput && (!machine.options || machine.options.length === 0)) {
      this.optionsCount = 0;
    }
  }

  checkAlertsCount() {
    const machine = this.config.Machines.List[this.machineName];
    if (this.useAlertsInput && (!machine.customAlerts || machine.customAlerts.length === 0)) {
      this.alertsCount = 0;
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
      if (!machine.hasOwnProperty('useAlerts')) { this.useAlertsInput = false; }

      this.iconInput = machine.icon;
      this.emailSubjectInput = machine.email.subject;
      this.emailTextInput = machine.email.text;

      this.machinesToSelectFrom = [];

      Object.keys(config.Machines.List).forEach(element => {
        if (element) {
          this.machinesToSelectFrom.push(element);
          // console.log(element);
        }
      });

      this.allowedMachinesTransferInput = [];


      if (machine['allowedMachinesTransfer']) {
        machine['allowedMachinesTransfer'].forEach(element => {
          this.allowedMachinesTransferInput.push(element);
        });
        this.machinesToSelectFrom = this.machinesToSelectFrom.filter(testMachine => {
            return this.allowedMachinesTransferInput.indexOf(testMachine) === -1;
        });
      } else {
        console.log('Created allowedMachinesTransfer in new config.');
      }

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

    newMachine.allowedMachinesTransfer = [];
    if (this.allowedMachinesTransferInput) {
      this.allowedMachinesTransferInput.forEach(element => {
        newMachine.allowedMachinesTransfer.push(element);
      });
    }

    // console.log(this.allowedMachinesTransferInput);

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
    this.postsService.setConfig(newConfig, true).subscribe(res => {
      if (newConfig) {
        this.config = newConfig;
      }
    });
  }

  inputsInvalid(): any {
    const machineAlreadyExists = this.isNewMachine && this.configValue.Machines.List[this.machineName];
    let requiredsEmpty = !this.countInput || !this.defaultMinutesInput || !(this.minMinutesInput !== undefined);
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
    if (JSON.stringify(newConfig) !== JSON.stringify(this.configValue)) {
      return false;
    } else {
      return true;
    }
  }

  addMachineToTransfer(machineKey: string) {
    if (this.allowedMachinesTransferInput.indexOf(machineKey) === -1) { // if it doesn't exist
      this.allowedMachinesTransferInput.push(machineKey);
      const possibleIndex = this.machinesToSelectFrom.indexOf(machineKey);
      if (possibleIndex !== -1) { // removes from machines to select from
        this.machinesToSelectFrom.splice(possibleIndex, 1);
      }
    } else { // already exists
      const snackBarRef = this.snackBar.open('Machine already added.', 'Close', {
        duration: 3000
      });
    }
  }

  removeMachineFromTransfer(i: number) {
    const machine = this.allowedMachinesTransferInput[i];
    if (this.machinesToSelectFrom.indexOf(machine) === -1) { // if doesn't exist in possible machines, add
      this.machinesToSelectFrom.push(machine);
    }
    this.allowedMachinesTransferInput.splice(i, 1);
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
