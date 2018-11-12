import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { PostsService } from '../../posts.services';

@Component({
  selector: 'app-machine-status',
  templateUrl: './machine-status.component.html',
  styleUrls: ['./machine-status.component.css']
})
export class MachineStatusComponent implements OnInit {

  objectKeys = Object.keys;

  baseImgSrc = '../../../assets/';

  serverQueried = false;

  @Input() machineAvailability: any;
  @Input() selectedIndex: number;
  @Input() MACHINES_LIST: any;
  @Output() selectedIndexChange = new EventEmitter();
  @Output() notify = new EventEmitter<string>();

  constructor(private postsService: PostsService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['machineAvailability']) {
        this.machineAvailability = this.machineAvailability;
    }

    if (changes['MACHINES_LIST']) {
      this.MACHINES_LIST = this.MACHINES_LIST;
    }
  }

  ngOnInit() {
  }

  getWashingStatus() {
    this.postsService.getWashingStatus().subscribe(result => {
      this.serverQueried = true;
      if (result === false) {
        return false;
      } else {
        return true;
      }
    });
  }

  getDryingStatus() {
    this.postsService.getDryingStatus().subscribe(result => {
      if (result === false) {
        return false;
      } else {
        return true;
      }
    });
  }

  changeTab(machine) {
    this.selectedIndex = this.selectedIndex ? 0 : 1;
    this.selectedIndexChange.emit(this.selectedIndex);
    this.notifyMachineReady(machine);
  }

  notifyMachineReady(machine) {
    this.notify.emit(machine);
  }

  getImgSrc(fileName) {
    return this.baseImgSrc + fileName;
  }


  getServerStatus() {
    this.postsService.getServerStatus().subscribe(result => {
      if (result === false) {
        return false;
      } else {
        return true;
      }
    });
  }

}
