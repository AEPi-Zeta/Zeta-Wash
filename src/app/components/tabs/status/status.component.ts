import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

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

  @Input() canRemoveFromUsageList: boolean;
  @Input() MACHINES_LIST: any;

  @Input() machineAvailability: any;

  @Input() usingListOnly ? = false; // optional parameter for having only the usingList available

  @Input() selectedIndex: number;
  @Output() selectedIndexChange = new EventEmitter();
  @Output() notify = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onNotifyMachine(machine: string) {
    this.notify.emit(machine);
  }

  onSelectedIndexChange(selectedIndex: number) {
    this.selectedIndexChange.emit(selectedIndex);
  }

}
