import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PostsService } from '../../posts.services';
import { ModifyMachineComponent } from '../modify-machine/modify-machine.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-modify-machines',
  templateUrl: './modify-machines.component.html',
  styleUrls: ['./modify-machines.component.scss']
})
export class ModifyMachinesComponent implements OnInit {

  objectKeys = Object.keys;

  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.config);
  }

  get config() {
    return this.configValue;
  }

  postsService: PostsService;

  machines: any;

  @Output() configChange = new EventEmitter();

  configValue: any;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.machines = this.configValue.Machines.List;
  }

  ngOnChanges(changes: SimpleChanges) {
    const newConfig = changes.config.currentValue;
  }

  setConfig(newConfig): any {
    this.postsService.setConfig(newConfig).subscribe(res => {
      if (newConfig) {
        this.config = newConfig;
      }
    });
  }

  deleteMachine(machine) {
    if (window.confirm('Are sure you want to delete this item?')) {
      const newConfig = this.configValue;
      if (newConfig.Machines.List[machine]) {
        delete newConfig.Machines.List[machine];
        this.setConfig(newConfig);
        const snackBarRef = this.snackBar.open('Successfully deleted machine. You may have to reload to see changes.', 'Close', {
          duration: 3000
        });
      } else {
        console.log('Machine does not exist!');
      }
    }
  }

  openAddMachine() {
    const dialogRef = this.dialog.open(ModifyMachineComponent, {
      height: '400px',
      width: '600px',
    });

    const instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.configValue;
    instance.isNewMachine = true;
    instance.machineName = 'New Machine';

  }
}