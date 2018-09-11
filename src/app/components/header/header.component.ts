import { Component, OnInit, Input } from '@angular/core';
import { MatToolbarModule, MatDialog, MatDialogRef } from '@angular/material';
import { LogComponent } from '../log/log.component';
import { PostsService } from '../../posts.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() topBarTitle: any;
  @Input() postsService: PostsService;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openLog() {
    let dialogRef = this.dialog.open(LogComponent, {
      height: '400px',
      width: '600px',
    });

    let instance = dialogRef.componentInstance;
    instance.postsService = this.postsService;

  }

}
