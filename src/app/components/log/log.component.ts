import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {PageEvent, MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { PostsService } from '../../posts.services';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent implements OnInit {

  displayedColumns = ['name', 'machine', 'endDate'];
  dataSource: MatTableDataSource<Element>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.getArray();
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  afterGetData() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        const filteredData = [];
        for (let i = 0; i < data.length; i++) {
          filteredData.push(this.createElement(data[i]));
        }

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(filteredData);

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
