import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import {PostsService} from '../../posts.services';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { SelectMachineComponent } from '../bottom-sheets/select-machine/select-machine.component';
import { SelectTimeComponent } from '../bottom-sheets/select-time/select-time.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent {

  machine: string;

  @Input() queue: any[];
  @Input() list: any[];

  @Input() canRemoveFromUsageList: boolean;
  @Input() canFinishReservation: boolean;
  @Input() MACHINES_LIST: any;

  @Input() machineAvailability: any;

  @Input() usingListOnly ? = false; // optional parameter for having only the usingList available

  configValue: any;
  mobile = false;

  @Input()
  set config(val) {
    this.configValue = val;
    this.configChange.emit(val);
  }

  get config() {
    return this.configValue;
  }

  @Output() configChange = new EventEmitter();

  public now: number = Math.floor(new Date().getTime() / 1000);


  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['machineAvailability']) {
        this.machineAvailability = this.machineAvailability;
    }
  }

  ngOnInit() {
    if (this.isMobile()) { // 768px portrait
      this.mobile = true;
    }
  }

  isMobile() {
    let check = false;
    // tslint:disable-next-line:max-line-length
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) { check = true; }})(navigator.userAgent || navigator.vendor || window['opera']);
    return check;
  }


  removeFromQueue(user) {
    const index = this.queue.indexOf(user);

    const queueObj = this.queue[index];

    this.postsService.removeFromList(queueObj, true)
      .subscribe(res => {
        this.queue.splice(index, 1);
    });
  }

  removeFromList(user) {
    const index = this.list.indexOf(user);

    const queueObj = this.list[index];


    this.postsService.removeFromList(queueObj, false)
      .subscribe(res => {
        this.list.splice(index, 1);
    });
  }

  moveFromQueueToList(user) {
    const index = this.queue.indexOf(user);

    const queueObj = this.queue[index];

    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;
    endTime = startTime + queueObj.minutes * 60;

    queueObj.startTime = startTime;
    queueObj.endTime = endTime;
    this.addToList(queueObj);
    this.removeFromQueue(user);
  }

  possibleMachineTransfers(machineKey: string) {
    const possibleMachines = [];
    Object.keys(this.machineAvailability).forEach(pluralMachineKey => {
      const machines = this.machineAvailability[pluralMachineKey];
      machines.forEach(machine => {
        if (machine.singularName === machineKey) {
          possibleMachines.push(machine);
        }
      });
    });
    return possibleMachines;
  }

  addToList(queueObj) {
    this.postsService.addToList(queueObj, false)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;
        const snackBarRef = this.snackBar.open('Reservation successfully made.', 'Close', {
          duration: 2000
        });
      });
  }

  handleAddToListSuccess(user, uniqueID) {
    // console.log('user with unique ID ' + uniqueID + ' added to list.');
  }

  handleAddToListFailure(user) {
    // TODO: MAKE DO SOMETHING
  }

  constructor(private postsService: PostsService, public snackBar: MatSnackBar, public bottomSheet: MatBottomSheet) {
    setInterval(() => {
      this.now = Math.floor(new Date().getTime() / 1000);
    }, 1);
  }

  sendEmailAlert(user, alertObject) {
    this.postsService.sendEmailAlert(user, alertObject).subscribe(res => {
      const snackBarRef = this.snackBar.open('Alert sent!', 'Close', {
        duration: 2000
      });
    },
    error => {
      const snackBarRef = this.snackBar.open('ERROR: Failed to send notification.', 'Close', {
        duration: 2000
      });
    });
  }

  openMachineSelectBottomSheet(user: any) {
    const selectMachineSheetRef = this.bottomSheet.open(SelectMachineComponent, {
      ariaLabel: 'Select a machine',
      data: { rootMachine: user.machine, machineAvailability: this.machineAvailability, MACHINES_LIST: this.MACHINES_LIST,
        moveReservationToMachine: this.moveReservationToMachine, user: user, postsService: this.postsService }
    });

    selectMachineSheetRef.instance.setDefaults();

    selectMachineSheetRef.afterDismissed().subscribe(res => {
      if (selectMachineSheetRef.instance.finishedSelection) {
        const specificMachine = selectMachineSheetRef.instance.specificMachine;
        this.moveReservationToMachine(user, specificMachine.key, this.MACHINES_LIST[specificMachine.singularName]['default_minutes']);
      }
    });

  }

  moveReservationToMachine(originalReservation: any, machine: string, minutes: number) {
    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;

    /*if (!this.isOnlyQueue) {
      endTime = startTime + minutes * 60;
    } else {
      endTime = null;
    }*/

    endTime = startTime + minutes * 60;

    const queueObj = {
      name: originalReservation.name,
      machine: machine.substring(0, machine.length - 1),
      machineNumber: machine.substring(machine.length - 1, machine.length),
      startTime: startTime,
      endTime: endTime,
      minutes: minutes,
      uniqueID: '',
    };

    this.finishReservation(originalReservation);

    this.addToList(queueObj);

  }

  finishReservation(listObj) {
    this.postsService.finishReservation(listObj).subscribe(res => {
      const index = this.list.indexOf(listObj);
      this.list.splice(index, 1); // removes object from list
      const snackBarRef = this.snackBar.open('Finished a reservation.', 'Close', {
        duration: 2000
      });
    },
    error => {
      const snackBarRef = this.snackBar.open('ERROR: Failed to end reservation.', 'Close', {
        duration: 2000
      });
    });
  }

  SecondsTohhmmss(totalSeconds) {
    if (totalSeconds > 0) {
      let hours = Math.floor(totalSeconds / 3600).toString();
      let minutes = Math.floor((totalSeconds % 3600) / 60).toString();
      let seconds = Math.floor(totalSeconds % 60).toString();

      hours = parseInt(minutes, 10) < 10 ? '0' + hours : hours;
      minutes = parseInt(minutes, 10) < 10 ? '0' + minutes : minutes;
      seconds = parseInt(seconds, 10) < 10 ? '0' + seconds : seconds;

      return hours + ':' + minutes + ':' + seconds;
    } else {
      return '';
    }
  }

  machineToIndex(name) {
    return parseInt(name.substring(name.length - 1, name.length), 10) - 1;
  }

  machineToPlural(name) {
    return name.substring(0, name.length - 1) + 's';
  }

}
