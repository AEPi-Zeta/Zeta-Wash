import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { PostsService } from '../../posts.services';

@Component({
  selector: 'app-machine-status',
  templateUrl: './machine-status.component.html',
  styleUrls: ['./machine-status.component.css']
})
export class MachineStatusComponent implements OnInit {
  washerInUse = true;
  washerDone: boolean;

  dryerInUse: boolean;
  dryerDone = true;

  serverQueried = false;

  washerColor = 'transparent';
  dryerColor = 'transparent';

  @Input() machineAvailability: any;
  @Input() selectedIndex: number;
  @Output() selectedIndexChange = new EventEmitter();
  @Output() notify = new EventEmitter<string>();

  constructor(private postsService: PostsService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['machineAvailability']) {
        this.machineAvailability = this.machineAvailability;
    }
  }

  ngOnInit() {
  }

  getWasherColor() {
    if (this.washerInUse) {
      return 'red';
    } else if (!this.serverQueried) {
      return 'transparent';
    } else {
      return 'green';
    }
  }

  getDryerColor() {
    if (this.dryerInUse) {
      return 'red';
    } else if (!this.serverQueried) {
      return 'transparent';
    } else {
      return 'green';
    }
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
