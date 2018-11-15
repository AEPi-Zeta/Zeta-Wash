import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-pin-input',
  templateUrl: './pin-input.component.html',
  styleUrls: ['./pin-input.component.scss']
})
export class PinInputComponent implements OnInit {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<PinInputComponent>) { }

  pinSet: boolean;

  pinInput: number;

  closedFromButton = false;

  ngOnInit() {
  }

  closeDialog() {
    this.closedFromButton = true;
    this.dialogRef.close();
  }

}
