import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import {PageEvent, MatPaginator, MatTableDataSource, MatSort, MatSnackBar} from '@angular/material';
import { PostsService } from '../../posts.services';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent implements OnInit {

  displayedColumns = ['name', 'machine', 'endDate', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() MACHINES_LIST;

  configValue: any;

  @Input() config;

  // MatPaginator Inputs
  length = 100;
  @Input() pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;


  constructor(public postsService: PostsService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getArray();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  afterGetData() {
    this.dataSource.sort = this.sort;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private getArray() {
    this.postsService.getLog('both')
      .subscribe((response) => {
        const data = response.log;

        // Sorts the data by last finished
        data.sort((a, b) => b.startTime - a.startTime);

        const filteredData = [];
        for (let i = 0; i < data.length; i++) {
          filteredData.push(this.createElement(data[i]));
        }

        // Assign the data to the data source for the table to render
        this.dataSource.data = filteredData;

        this.afterGetData();

      },
      error => {
        this.getArray();
      });
  }

  createElement(listObj) {
    const newObj = {};
    newObj['name'] = listObj['name'];
    newObj['endDate'] = this.timeConverter(listObj['endTime']);
    newObj['machine'] = listObj['machine'] + ' ' + listObj['machineNumber'];
    return newObj;
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
    const time = hour + ':' + min + ':' + sec + ' ' + date + ' ' + month + ' ' + year ;
    return time;
  }
}

export interface Element {
  name: string;
  endDate: string;
  machine: string;
}
