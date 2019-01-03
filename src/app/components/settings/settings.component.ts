import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, Inject } from '@angular/core';
import { PostsService } from '../../posts.services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.config);
  }

  get config() {
    return this.configValue;
  }

  @Input() auth: any;

  @Output() configChange = new EventEmitter();

  alertOptions = ['None', 'email'];
  emailServiceOptions = [
    'AOL',
    'Gmail',
    'Godaddy',
    'Hotmail',
    'iCloud',
    'Mailgun',
    'Mailjet',
    'Mandrill',
    'Naver',
    'Postmark',
    'Yahoo',
    'Zoho',
    'Custom'
  ];

  configValue: any;

  titleInput: string;
  requirePinForSettingsInput: boolean;
  logAdminOnlyInput: boolean;
  removeMachineAdminOnlyInput: boolean;
  customUsersListInput: boolean;
  forceCustomUsersListInput: boolean;
  alertServiceInput: string;
  emailServiceInput: string;
  emailUserInput: string;
  emailPasswordInput: string;
  emailHostInput: string;
  emailPortInput: string;
  useQueueInput: boolean;
  useEncryptionInput: boolean;
  certFilePathInput: string;
  keyFilePathInput: string;



  constructor(public postsService: PostsService, @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<SettingsComponent>) {

  }

  ngOnInit() {
    this.setValuesFromConfigAndAuth();
  }

  setValuesFromConfigAndAuth() {
    const newConfig = this.configValue;
    this.titleInput = newConfig.Extra.titleTop;
    this.requirePinForSettingsInput = newConfig.Users.requirePinForSettings;
    this.logAdminOnlyInput = newConfig.Users.logAdminOnly;
    this.removeMachineAdminOnlyInput = newConfig.Users.removeMachineAdminOnly;
    this.customUsersListInput = newConfig.Users.customUsersList;
    this.forceCustomUsersListInput = newConfig.Users.forceCustomUsersList;
    this.alertServiceInput = newConfig.Users.alertService;
    this.useQueueInput = newConfig.Machines.useQueue;
    this.useEncryptionInput = newConfig.Encryption.useEncryption;
    this.certFilePathInput = newConfig.Encryption.certFilePath;
    this.keyFilePathInput = newConfig.Encryption.keyFilePath;
    this.emailUserInput = this.auth.Email.user;
    this.emailPasswordInput = this.auth.Email.pass;
    if (this.emailServiceInput !== 'Custom') {
      this.emailServiceInput = newConfig.Users.Email.service;
    } else {
      this.emailHostInput = newConfig.Users.Email.host;
      this.emailPortInput = newConfig.Users.Email.port;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const newConfig = changes.config.currentValue;
    this.titleInput = newConfig.Extra.titleTop;
    this.requirePinForSettingsInput = newConfig.Users.requirePinForSettings;
    this.logAdminOnlyInput = newConfig.Users.logAdminOnly;
    this.removeMachineAdminOnlyInput = newConfig.Users.removeMachineAdminOnly;
    this.customUsersListInput = newConfig.Users.customUsersList;
    this.forceCustomUsersListInput = newConfig.Users.forceCustomUsersList;
    this.alertServiceInput = newConfig.Users.alertService;
    this.useQueueInput = newConfig.Machines.useQueue;
    this.useEncryptionInput = newConfig.Encryption.useEncryption;
    this.certFilePathInput = newConfig.Encryption.certFilePath;
    this.keyFilePathInput = newConfig.Encryption.keyFilePath;
    this.emailUserInput = this.auth.Email.user;
    this.emailPasswordInput = this.auth.Email.pass;
    if (this.emailServiceInput !== 'Custom') {
      this.emailServiceInput = newConfig.Users.Email.service;
    } else {
      this.emailHostInput = newConfig.Users.Email.host;
      this.emailPortInput = newConfig.Users.Email.port;
    }
  }

  createAuth(): any {
    const newAuth = JSON.parse(JSON.stringify(this.auth));
    newAuth.Email.user = this.emailUserInput;
    newAuth.Email.pass = this.emailPasswordInput;
    return newAuth;
  }

  createConfig(): any {
    const newConfig = JSON.parse(JSON.stringify(this.configValue));
    newConfig.Extra.titleTop = this.titleInput;
    newConfig.Users.requirePinForSettings = this.requirePinForSettingsInput;
    newConfig.Users.logAdminOnly = this.logAdminOnlyInput;
    newConfig.Users.removeMachineAdminOnly = this.removeMachineAdminOnlyInput;
    newConfig.Users.customUsersList = this.customUsersListInput;
    newConfig.Users.forceCustomUsersList = this.forceCustomUsersListInput;
    newConfig.Users.alertService = this.alertServiceInput;
    newConfig.Users.Email.service = this.emailServiceInput;
    newConfig.Machines.useQueue = this.useQueueInput;
    newConfig.Encryption.useEncryption = this.useEncryptionInput;
    newConfig.Encryption.certFilePath = this.certFilePathInput;
    newConfig.Encryption.keyFilePath = this.keyFilePathInput;

    if (this.emailServiceInput !== 'Custom' && this.customUsersListInput) {
      newConfig.Users.Email.service = this.emailServiceInput;
    } else {
      newConfig.Users.Email.host = this.emailHostInput;
      newConfig.Users.Email.port = this.emailPortInput;
    }

    return newConfig;
  }

  setConfig(): any {
    const newConfig = this.createConfig();
    this.postsService.setConfig(newConfig).subscribe(res => {
      this.config = newConfig;
    });
  }

  setAuth(): any {
    const newAuth = this.createAuth();
    this.postsService.setAuth(newAuth).subscribe(res => {
      this.auth = newAuth;
    });
  }

  onSaveConfig(): any {
    this.setConfig();
    this.setAuth();
  }

  close(): any {
    this.dialogRef.close();
  }

  checkSettingsSame(): boolean {
    const newConfig = this.createConfig();
    const newAuth = this.createAuth();
    return JSON.stringify(newConfig) === JSON.stringify(this.configValue) && JSON.stringify(newAuth) === JSON.stringify(this.auth);
  }
}

function findWithAttr(array, attr, value) {
  for (let i = 0; i < array.length; i++) {
      if (array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}
