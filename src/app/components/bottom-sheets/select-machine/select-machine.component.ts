import { Component, OnInit, Inject } from '@angular/core';
import { SelectTimeComponent } from '../select-time/select-time.component';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PostsService } from '../../../posts.services';

@Component({
  selector: 'app-select-machine',
  templateUrl: './select-machine.component.html',
  styleUrls: ['./select-machine.component.scss']
})
export class SelectMachineComponent implements OnInit {

  constructor(public bottomSheet: MatBottomSheet, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private bottomSheetRef: MatBottomSheetRef<SelectMachineComponent>) {
  }

  machineAvailability: any;
  rootMachine: any;
  MACHINES_LIST: any;
  allowedMachines: string[];
  machinesToChooseFrom: any[];
  moveReservationToMachine: any;
  user: any;
  postsService: PostsService;
  finishedSelection = false;
  specificMachine: any;

  ngOnInit() {

  }

  setDefaults() {
    this.machineAvailability = this.data['machineAvailability'];
    this.rootMachine = this.data['rootMachine'];
    this.MACHINES_LIST = this.data['MACHINES_LIST'];
    this.allowedMachines = this.MACHINES_LIST[this.rootMachine]['allowedMachinesTransfer'];
    this.moveReservationToMachine = this.data['moveReservationToMachine'];
    this.user = this.data['user'];
    this.postsService = this.data['postsService'];

    this.machinesToChooseFrom = [];
    Object.keys(this.machineAvailability).forEach(element => {
      this.machineAvailability[element].forEach(specificMachine => {
        if (this.allowedMachines.indexOf(specificMachine.singularName) > -1) {
          this.machinesToChooseFrom.push(specificMachine);
        }
      });
    });
  }

  openTimeSelectBottomSheet(specificMachine: any) {
    const useOptions = this.MACHINES_LIST[specificMachine.singularName]['useOptions'];
    if (useOptions) {
      const selectMachineSheetRef = this.bottomSheet.open(SelectTimeComponent, {
        ariaLabel: 'Select a time',
        data: { specificMachine: specificMachine, MACHINES_LIST: this.MACHINES_LIST,
          moveReservationToMachine: this.moveReservationToMachine, user: this.user, postsService: this.postsService }
      });
    } else {
      this.finishedSelection = true;
      this.specificMachine = specificMachine;
      this.bottomSheetRef.dismiss();
    }
  }

  timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    let hour = a.getHours().toString();
    let min = a.getMinutes().toString();
    let sec = a.getSeconds().toString();
    if (parseInt(sec, 10) < 10) { sec = '0' + sec; }
    if (parseInt(hour, 10) < 10) { hour = '0' + hour; }
    if (parseInt(min, 10) < 10) { min = '0' + min; }
    const time = hour + ':' + min + ':' + sec + ' ' + date + ' ' + month + ' ' + year ;
    return time;
  }

}
