import { Component, OnInit, Directive, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { PostsService } from './posts.services';
import {Observable} from 'rxjs/Rx';
import { of } from 'rxjs';
import consts from './utils/consts';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PinInputComponent } from './components/pin-input/pin-input.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { LogComponent } from './components/log/log.component';
import { ModifyMachinesComponent } from './components/modify-machines/modify-machines.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ModifyMachineComponent } from './components/modify-machine/modify-machine.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PostsService]
})

export class AppComponent implements OnInit {
  title = 'app';
  name: string;
  list: any[];
  queue: any[];
  machine: string;
  machineAvailability: object = null;
  defaultTab = 0;
  tempBlockNavigation = false;
  _selectedIndex: any;
  openLogDialog: any;
  openModifyMachinesDialog: any;
  openAddMachineDialog: any;
  logoutDialogContent = 'Are you sure you want to log out? You will need to sign in manually next time.';
  get selectedIndex(): any {
    return this._selectedIndex;
  }
  set selectedIndex(theSelectedIndex: any) {
      if (this._selectedIndex !== theSelectedIndex) {
        if (!this.tempBlockNavigation) {
          if (theSelectedIndex === undefined) {
            theSelectedIndex = this.defaultTab;
            this._selectedIndex = this.defaultTab;
          }
          if (this.router.url !== '/') {
            // the first navigation is complete and the URL is set
            this.router.navigate([consts.setURLElement
              (this.router.url, 1, this.INDEX_TO_ROUTE_CONVERTER[theSelectedIndex])]); // sets url back to what it was before
          } else {
            this.router.events.filter(e => e instanceof NavigationEnd).first().subscribe(() => {
              // the first navigation is complete and the URL is set
              this.router.navigate([consts.setURLElement
                (this.router.url, 1, this.INDEX_TO_ROUTE_CONVERTER[theSelectedIndex])]); // sets url back to what it was before

            });
          }
        }
      }
      if (theSelectedIndex !== undefined) { this._selectedIndex = theSelectedIndex; }
  }
  topBarTitle: string;
  hasList = false;
  useQueue = true;
  devPath = 'http://localhost:8088/';
  mobile: boolean;
  isFullScreen = false;

  pinSet: boolean;
  requirePinForSettings: boolean;
  forceCustomUsersList: boolean;
  isAuthenticated = false;
  authReached = false;
  afterAuthFinished = false;
  canRemoveFromUsageList: boolean;

  config = null;
  MACHINES_LIST: any;
  auth = null;
  users: any[] = [];

  pathChecked = false;

  ROUTES_CONFIG = {
    signup: {
      indexValue: 0
    },
    status: {
      indexValue: 1
    }
  };

  INDEX_TO_ROUTE_CONVERTER = {

  };

  openSettingsDialog = false;

  oldURL: string;
  currentURL: string;

  constructor(public postsService: PostsService, private dialog: MatDialog,
    public snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute,
    location: PlatformLocation) { // init for the beginning of the app
    const queueType = 'both';
    this.postsService.getConfig(isDevMode()).subscribe(result => { // loads settings
      this.config = result.ZetaWash;
      this.topBarTitle = result.ZetaWash.Extra.titleTop;
      this.useQueue = result.ZetaWash.Machines.useQueue;
      this.postsService.backendPath = result.ZetaWash.Host.backendURL;

      this.MACHINES_LIST = result.ZetaWash.Machines.List;

      this.canRemoveFromUsageList = !result.ZetaWash.removeMachineAdminOnly;
      this.forceCustomUsersList = result.ZetaWash.Users.forceCustomUsersList;

      this.postsService.getList(queueType).subscribe(res => {
        this.list = this.queueResponseToQueue(res.fullList.list);
        this.queue = this.queueResponseToQueue(res.fullList.queue);

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
        this.listReached();
      }, error => { // if users.json cannot be reached
        const snackBarRef = this.snackBar.open('ERROR: Failed to get list of current users from server.', 'Close', {
          duration: 2000
        });
      });

      if (result.ZetaWash.Users.requirePinForSettings) {
        this.authReached = true;
        this.pinSet = result.ZetaWash.Users.pinSet;
        this.requirePinForSettings = result.ZetaWash.Users.requirePinForSettings;

        if (localStorage.getItem('pin')) {
          this.getAuth();
        }
      } else {
        this.getAuth();
      }

      if (result.ZetaWash.Users.customUsersList) {
        this.postsService.getUsers().subscribe(res => {
          this.users = res.users;
          this.users.sort(function(a, b) { // properly sorts emails in alphabetical order
            const textA = a.toUpperCase();
            const textB = b.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
        }, error => {
          const snackBarRef = this.snackBar.open('ERROR: Failed to get list of users from server.', 'Close', {
            duration: 2000
          });
        });
      }
    },
    error => {
      const snackBarRef = this.snackBar.open('ERROR: Cannot access server, see console for details. Check your ports and \
      make sure the config file is web-accessable.', 'Close', {});
      console.error('Server Error:\n\n' + error);
    });

    router.events.subscribe((_: NavigationEnd) => { // sets the relative url for routing info, and calls onNavigation function
      if (this.currentURL === undefined && _.url !== undefined) {
        this.currentURL = _.url;
      }

      if (_.url && _.url !== undefined) {
        this.currentURL = _.url;
      }

      if (this.currentURL !== this.oldURL) {
        this.oldURL = this.currentURL;
        this.onNavigation('/#' + _.url);
      }
    });

    for (const routeConfig in this.ROUTES_CONFIG) {
      if (this.ROUTES_CONFIG[routeConfig]) {
        this.INDEX_TO_ROUTE_CONVERTER[this.ROUTES_CONFIG[routeConfig].indexValue.toString()] = routeConfig;
      }
    }
  }

  ngOnInit() {
    // creates timer for checking times
    const timer = Observable.timer(0, 2000);
    timer.subscribe(t => {
      const queueType = 'both';
      this.postsService.getList(queueType).subscribe(res => {
        const newList = this.queueResponseToQueue(res.fullList.list);
        const newQueue = this.queueResponseToQueue(res.fullList.queue);

        if (JSON.stringify(this.list) !== JSON.stringify(newList)) {
          this.list = newList;
        }
        if (JSON.stringify(this.queue) !== JSON.stringify(newQueue)) {
          this.queue = this.queueResponseToQueue(res.fullList.queue);
        }

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
      });
      if (this.hasList) {
        this.checkQueue();
        this.listReached();
      }
    });
  }

  onNavigation(url: string) {
    if (url) {
      // gets component parts of URL, first one (index 0) is empty since the string begins with a '/', second one is #
      const urlComponents = url.split('/');

      const firstElement = urlComponents[2];

      if (firstElement) {
        this.tempBlockNavigation = true;
        if (firstElement === 'signup') {
          this.selectedIndex = this.ROUTES_CONFIG.signup.indexValue;
        } else if (firstElement === 'status') {
          this.selectedIndex = this.ROUTES_CONFIG.status.indexValue;
        }
        this.tempBlockNavigation = false;
      }

      const secondElement = urlComponents[3];

      if (secondElement) {
        if (secondElement === 'auth') {
          this.authDialog();
        } else if (secondElement === 'log') {
          this.rootOpenLog();
        } else if (secondElement === 'settings') {
          if (this.isAuthenticated) { this.rootOpenModifySettings(); } else { this.openSettingsDialog = true; }
        } else if (secondElement === 'machines') {
          if (this.isAuthenticated) { this.rootOpenModifyMachines(); } else { this.openModifyMachinesDialog = true; }
        }
      }

      const thirdElement = urlComponents[4];

      if (thirdElement) {
        if (thirdElement === 'add-machine') {
          if (this.isAuthenticated) { this.rootOpenAddMachine(); } else { this.openAddMachineDialog = true; }
        }
      }

      this.pathChecked = true; // indicates the URL has been parsed and requires no further parsing
    }
  }

  listReached() {
    this.hasList = true;
    this.machineAvailability = {};
    for (const machine in this.MACHINES_LIST) {
      if (machine) {
        const machineName = machine;
        const machinePlural = machineName + 's';
        this.machineAvailability[machinePlural] = [];
        for (let i = 0; i < this.MACHINES_LIST[machineName]['count']; i++) {
          this.machineAvailability[machinePlural][i] = {};
          const specificMachineAvailability = this.machineAvailability[machinePlural][i];
          // checks whether it's in use or not
          specificMachineAvailability['inUse'] = this.checkIfMachineInUse(this.list, machineName + (i + 1));

          specificMachineAvailability['key'] = machineName + (i + 1);

          specificMachineAvailability['longName'] = machineName.substring(0, 1).toUpperCase() +
          machineName.substring(1, machineName.length) + ' ' + (i + 1);

          specificMachineAvailability['singularName'] = machine;
        }
      }
    }
  }

  queueResponseToQueue(queueResponse) {
    const newQueueArray = [];
    for (let i = 0; i < queueResponse.length; i++) {
      newQueueArray.push(queueResponse[i].listObj);
    }
    return newQueueArray;
  }

  checkQueue() {
    if (this.list) {
      for (let i = 0; i < this.list.length; i++) {
        const queueObj = this.list[i];
        if (queueObj.endTime < Math.floor(Date.now() / 1000)) {
          this.list.splice(i, 1);  // deletes item locally if the time is over
        }
      }
    }
  }

  checkAuth(pincode: string) {
    this.postsService.checkAuth(pincode).subscribe(res => {
      if (res.authenticated) {

        localStorage.setItem('pin', pincode); // sets password in local storage

        // get authentication JSON from server
        this.getAuth();
      } else {
        const snackBarRef = this.snackBar.open('Authentication failed.', 'Close', {
          duration: 2000
        });
      }
    });
  }

  setPin(pincode: string) { // sets specified pin as the pin
    this.postsService.getAuth().subscribe(res => {
      this.auth = res.auth;
      this.auth['App']['pinCode'] = pincode;
      this.postsService.setAuth(this.auth).subscribe(() => {
        this.config['Users']['pinSet'] = true;
        this.postsService.setConfig(this.config).subscribe (() => {
          const snackBarRef = this.snackBar.open('Successfully set pin! Reloading page...', 'Close', {
            duration: 2000
          });
          snackBarRef.afterDismissed().subscribe(snack => {
            location.reload();
          });
        },
        error => {
          const snackBarRef = this.snackBar.open('ERROR: Failed to set configuration. Please try again.');
        });
      },
      error => {
        const snackBarRef = this.snackBar.open('ERROR: Failed to set authentication.');
      });
    });
  }

  logoutDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    const instance = dialogRef.componentInstance;
    instance.dialogContent = this.logoutDialogContent;

    dialogRef.afterClosed().subscribe(result => {
      const isConfirmed = instance.isConfirmed;
      if (isConfirmed) {
        this.isAuthenticated = false;
        this.logoutUser();
      }
    });
  }

  authDialog() {
    const oldURL = this.router.url;
    const dialogRef = this.dialog.open(PinInputComponent, consts.DIALOG_CONFIGS.PinInputDialog);

    const instance = dialogRef.componentInstance;
    instance.pinSet = this.pinSet;

    dialogRef.afterClosed().subscribe(result => {
      // makes sure that the dialog was closed from the button before setting pin or checking authentication
      if (instance.closedFromButton) {
        if (this.pinSet) {
          this.checkAuth(String(instance.pinInput));
        } else {
          this.setPin(String(instance.pinInput));
        }
      }
      this.router.navigate([consts.setURLElement(oldURL, 2, null)]); // sets url back to what it was before
    });
  }

  getAuth() {
    this.postsService.getAuth().subscribe(res => {
      this.auth = res.auth;
      this.isAuthenticated = true;
      this.canRemoveFromUsageList = true;
      const snackBarRef = this.snackBar.open('Logged in!', 'Close', {
        duration: 2000
      });
      this.afterAuthFinished = true;
      if (this.openSettingsDialog) { // checks to see if dialogs are waiting to open after auth is loaded
        this.rootOpenModifySettings();
      } else if (this.openLogDialog) {
        this.rootOpenLog();
      } else if (this.openModifyMachinesDialog) {
        this.rootOpenModifyMachines();
        if (this.openAddMachineDialog) {
          this.rootOpenAddMachine();
        }
      }
    }, error => {
      const snackBarRef = this.snackBar.open('ERRROR: Failed to authenticate.', 'Close', {
        duration: 2000
      });
      this.afterAuthFinished = true;
    });
  }

  /**
   * Log out functions
   */

  should_logout() { // if the user should be offered to log out of the service
    if (this.isAuthenticated || !this.config.Users.requirePinForSettings) {
      return true;
    } else {
      return false;
    }
  }

  openAuthOrLogout() {
    if (this.should_logout()) { // if should_logout
      this.logoutDialog();
    } else {
      this.router.navigate([this.INDEX_TO_ROUTE_CONVERTER[this.selectedIndex] + '/auth']);
    }
  }

  logoutUser() {
    localStorage.removeItem('pin');
    const snackBarRef = this.snackBar.open('Successfully logged out! Reloading page...', 'Close', {
      duration: 2000
    });
    snackBarRef.afterDismissed().subscribe(snack => {
      location.reload();
    });
  }

  getMachineCountInUse(queue, machine: string) {
    let machineCount = 0;
    queue.forEach(element => {
      if (element.machine === machine) {
        machineCount++;
      }
    });
    return machineCount;
  }

  checkIfMachineInUse(queue, specificMachine: string) {
    let isInUse = false;
    queue.forEach(element => {
      if (element['machine'] + element['machineNumber'] === specificMachine) {
        isInUse = true;
      }
    });
    return isInUse;
  }


  onNotifyMachine(machine: string) {
    this.machine = machine;
  }

  onSelectedIndexChange(selectedIndex: number) {
    this.selectedIndex = selectedIndex;
  }

  toggleFullScreen() {
    const elem = document.documentElement;
    if (!document['fullscreenElement'] && !document['mozFullScreenElement'] &&
      !document['webkitFullscreenElement'] && !document['msFullscreenElement']) {
      this.isFullScreen = true;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen']();
      } else if (elem['mozRequestFullScreen']) {
        elem['mozRequestFullScreen']();
      } else if (elem['webkitRequestFullscreen']) {
        elem['webkitRequestFullscreen']();
      }
    } else {
      this.isFullScreen = false;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document['msExitFullscreen']) {
        document['msExitFullscreen']();
      } else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
      } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
      }
    }
  }

  /**
   * Open dialog functions
   */

  rootOpenLog() {
    const oldURL = this.router.url;
    const dialogRef = this.dialog.open(LogComponent, consts.DIALOG_CONFIGS.LogDialog);

    const instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.MACHINES_LIST = this.MACHINES_LIST;
    instance.config = this.config;

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([consts.setURLElement(oldURL, 2, null)]);
    });
  }

  rootOpenModifyMachines() {
    const oldURL = this.router.url;
    const dialogRef = this.dialog.open(ModifyMachinesComponent, consts.DIALOG_CONFIGS.ModifyMachinesDialog);

    const instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.config;

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([consts.setURLElement(oldURL, 2, null)]);
    });
  }

  rootOpenModifySettings() {
    const oldURL = this.router.url;
    const dialogRef = this.dialog.open(SettingsComponent, consts.DIALOG_CONFIGS.SettingsDialog);

    const instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.config;
    instance.auth = this.auth;

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([consts.setURLElement(oldURL, 2, null)]);
    });
  }

  rootOpenAddMachine() {
    const oldURL = this.router.url;
    const dialogRef = this.dialog.open(ModifyMachineComponent, consts.DIALOG_CONFIGS.ModifyMachineDialog);

    const instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;
    instance.config = this.config;
    instance.isNewMachine = true;
    instance.machineName = 'New Machine';

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([consts.setURLElement(oldURL, 3, null)]);
    });
  }

}
