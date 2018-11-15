import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { PostsService } from './posts.services';
import {Observable} from 'rxjs/Rx';
// import MACHINES_LIST from './utils/consts';
import { MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { PinInputComponent } from './components/pin-input/pin-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PostsService]
})

export class AppComponent {
  title = 'app';
  name: string;
  list: any[];
  queue: any[];
  machine: string;
  machineAvailability: object = null;
  selectedIndex: any;
  topBarTitle: string;
  hasList = false;
  useQueue = true;
  isDev = false;
  devPath = 'http://localhost:8088/';
  mobile: boolean;
  isFullScreen = false;

  pinSet: boolean;
  requirePinForSettings: boolean;
  isAuthenticated = false;
  authReached = false;

  config = null;
  MACHINES_LIST: any;
  auth = null;
  users: any[] = [];

  constructor(public postsService: PostsService, private dialog: MatDialog,
    public snackBar: MatSnackBar) { // init for the beginning of the app
    const queueType = 'both';
    this.postsService.getConfig(this.isDev).subscribe(result => { // loads settings
      this.config = result.ZetaWash;
      this.topBarTitle = result.ZetaWash.Extra.titleTop;
      this.useQueue = result.ZetaWash.Machines.useQueue;
      this.postsService.path = result.ZetaWash.Host.backendURL;

      this.MACHINES_LIST = result.ZetaWash.Machines.List;

      this.postsService.getList(queueType).subscribe(res => {
        this.list = this.queueResponseToQueue(res.fullList.list);
        this.queue = this.queueResponseToQueue(res.fullList.queue);

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
        this.listReached();
      }, error => {
        const snackBarRef = this.snackBar.open('ERROR: Failed to get list of current users from server.', 'Close', {
          duration: 2000
        });
      });

      if (result.ZetaWash.Users.requirePinForSettings) {
        this.authReached = true;
        this.pinSet = result.ZetaWash.Users.pinSet;
        this.requirePinForSettings = result.ZetaWash.Users.requirePinForSettings;
      } else {
        this.getAuth();
      }

      if (result.ZetaWash.Users.customUsersList) {
        this.postsService.getUsers().subscribe(res => {
          this.users = res.users;
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
  }

  ngOnInit() {
    // creates timer for checking times
    const timer = Observable.timer(0, 1000);
    timer.subscribe(t => {
      const queueType = 'both';
      this.postsService.getList(queueType).subscribe(res => {
        this.list = this.queueResponseToQueue(res.fullList.list);
        this.queue = this.queueResponseToQueue(res.fullList.queue);

        // sorts queue
        this.queue.sort(function(a, b) {return (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0); });
      });
      if (this.hasList) {
        this.checkQueue();
        this.listReached();
      }
    });
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
        this.getAuth();
      } else {
        const snackBarRef = this.snackBar.open('Authentication failed.', 'Close', {
          duration: 2000
        });
      }
    });
  }

  setPin(pincode: string) {
    this.postsService.getAuth().subscribe(res => {
      this.auth = res.auth;
      this.auth['App']['pinCode'] = pincode;
      this.postsService.setAuth(this.auth).subscribe(res => {
        this.config['Users']['pinSet'] = true;
        this.postsService.setConfig(this.config).subscribe (res => {
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

  authDialog() {
    const dialogRef = this.dialog.open(PinInputComponent, {
      height: '400px',
      width: '600px',
    });

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
    });
  }

  getAuth() {
    this.postsService.getAuth().subscribe(res => {
      this.auth = res.auth;
      this.isAuthenticated = true;
      const snackBarRef = this.snackBar.open('Logged in!', 'Close', {
        duration: 2000
      });
    }, error => {
      const snackBarRef = this.snackBar.open('ERRROR: Failed to authenticate.', 'Close', {
        duration: 2000
      });
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

  toggleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document['mozFullScreenElement'] &&
      !document.webkitFullscreenElement && !document['msFullscreenElement']) {
      this.isFullScreen = true;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen']();
      } else if (elem['mozRequestFullScreen']) {
        elem['mozRequestFullScreen']();
      } else if (elem.webkitRequestFullscreen) {
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
      } else if (document.webkitExitFullscreen) {
        document['webkitExitFullscreen']();
      }
    }
  }

}
