import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatToolbarModule, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { LogComponent } from '../log/log.component';
import { PostsService } from '../../posts.services';
import { ModifyMachinesComponent } from '../modify-machines/modify-machines.component';
import { SettingsComponent } from '../settings/settings.component';
import consts from '../../utils/consts';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() topBarTitle: any;
  @Input() postsService: PostsService;

  @Input() requirePinForSettings: boolean;
  @Input() pinSet: boolean;

  @Input() auth: any;

  @Input() isAuthenticated: boolean;

  logAdminOnly = true;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {

  }

  @Input()
  set config(val) {
    this.configValue = val;
    if (val) {
      this.logAdminOnly = this.configValue.Users.logAdminOnly;
    }
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
    if (changes.config) {
      const newConfig = changes.config.currentValue;
    }
  }

  openLog() {
    this.router.navigate([this.router.url + '/log']);
  }

  openModifyMachines() {
    this.router.navigate([this.router.url + '/machines']);
  }

  openModifySettings() {
    this.router.navigate([this.router.url + '/settings']);
  }

}
