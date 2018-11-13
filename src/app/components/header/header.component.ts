import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule, MatDialog, MatDialogRef } from '@angular/material';
import { LogComponent } from '../log/log.component';
import { PostsService } from '../../posts.services';
import { ModifyMachinesComponent } from '../modify-machines/modify-machines.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() topBarTitle: any;
  @Input() postsService: PostsService;

  @Input() requirePinForSettings: boolean;
  @Input() pinSet: boolean;

  @Input() auth: any;

  @Input() isAuthenticated: boolean;

  constructor(public dialog: MatDialog) {

  }

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

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const newConfig = changes.config.currentValue;
  }

  openLog() {
    let dialogRef = this.dialog.open(LogComponent, {
      height: '400px',
      width: '600px',
    });

    let instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;

  }

  openModifyMachines() {
    let dialogRef = this.dialog.open(ModifyMachinesComponent, {
      height: '750px',
      width: '1200px',
    });

    let instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.configValue;
  }

  openModifySettings() {
    let dialogRef = this.dialog.open(SettingsComponent, {
      height: '750px',
      width: '1200px',
    });

    let instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.configValue;
    instance.auth = this.auth;
  }

}
