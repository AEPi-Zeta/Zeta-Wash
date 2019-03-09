import { Component, OnInit, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { PostsService } from '../../../posts.services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss']
})
export class SelectTimeComponent implements OnInit {

  specificMachine: any;
  MACHINES_LIST: any;
  moveReservationToMachine: any;
  user: any;
  postsService: PostsService;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, public snackBar: MatSnackBar,
  private bottomSheetRef: MatBottomSheetRef<SelectTimeComponent>) { }

  ngOnInit() {
    this.MACHINES_LIST = this.data['MACHINES_LIST'];
    this.specificMachine = this.data['specificMachine'];
    this.moveReservationToMachine = this.data['moveReservationToMachine'];
    this.user = this.data['user'];

    this.postsService = this.data['postsService'];

  }

  addToList(queueObj) {
    this.bottomSheetRef.dismiss();
    this.postsService.addToList(queueObj, false)
      .subscribe(res => {
        const didSucceed = res.opCode === '200';
        const uniqueID = res.uniqueID;
        const snackBarRef = this.snackBar.open('Reservation successfully made.', 'Close', {
          duration: 2000
        });
      });
  }

  finishReservation(listObj) {
    this.postsService.finishReservation(listObj).subscribe(res => {
      // const index = this.list.indexOf(listObj);
      // this.list.splice(index, 1); // removes object from list
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
    const time = (parseInt(hour, 10) % 12).toString() + ':' + min + ' ' + (parseInt(hour, 10) > 11 ? 'PM' : 'AM');
    return time;
  }

  getEndDate(minutes) {
    const startTime = Math.round((new Date()).getTime() / 1000);
    let endTime;

    /*if (!this.isOnlyQueue) {
      endTime = startTime + minutes * 60;
    } else {
      endTime = null;
    }*/

    endTime = startTime + minutes * 60;
    const date = this.timeConverter(endTime);
    return date;
  }

}
