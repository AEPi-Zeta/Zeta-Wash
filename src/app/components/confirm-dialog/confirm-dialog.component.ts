import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() dialogContent: string;

  isConfirmed = false;

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

  setConfirmed() {
    this.isConfirmed = true;
    this.dialogRef.close();
  }

}
