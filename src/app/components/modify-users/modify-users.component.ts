import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {PageEvent, MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialog, MatDialogRef} from '@angular/material';
import { PostsService } from '../../posts.services';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddUsersComponent } from '../add-users/add-users.component';


@Component({
  selector: 'app-modify-users',
  templateUrl: './modify-users.component.html',
  styleUrls: ['./modify-users.component.scss']
})
export class ModifyUsersComponent implements OnInit {

  displayedColumns = ['name', 'email', 'actions'];
  dataSource = new MatTableDataSource();

  deleteDialogContentSubstring = 'Are you sure you want delete user ';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // MatPaginator Inputs
  length = 100;
  @Input() pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  users: any;
  editObject = null;
  constructedObject = {};


  constructor(public postsService: PostsService, public snackBar: MatSnackBar, public dialog: MatDialog,
    private dialogRef: MatDialogRef<ModifyUsersComponent>) { }

  ngOnInit() {
    this.getArray();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.postsService.getUsersJSON()
      .subscribe((response) => {
        this.users = response.users.users;
        const data = this.users;

        this.createAndSortData();

        this.afterGetData();

      },
      error => {
        this.getArray();
      });
  }

  createAndSortData() {
    // Sorts the data by last finished
    this.users.sort((a, b) => b.name > a.name);

    const filteredData = [];
    for (let i = 0; i < this.users.length; i++) {
      filteredData.push(this.createElement(this.users[i]));
    }

    // Assign the data to the data source for the table to render
    this.dataSource.data = filteredData;
  }

  finishEditing(user_name) {
    let has_finished = false;
    if (this.constructedObject && this.constructedObject['name'] && this.constructedObject['email']) {
      if (!isEmptyOrSpaces(this.constructedObject['name']) && !isEmptyOrSpaces(this.constructedObject['email'])) {
        has_finished = true;
        const index_of_object = this.indexOfUser(user_name);
        this.users[index_of_object] = this.constructedObject;
        this.constructedObject = {};
        this.editObject = null;
        this.setUsers();
        this.createAndSortData();
      }
    }
  }

  enableEditMode(user_name) {
    if (this.nameInUserList(user_name) && this.indexOfUser(user_name) > -1) {
      const users_index = this.indexOfUser(user_name);
      this.editObject = this.users[users_index];
      this.constructedObject['name'] = this.users[users_index].name;
      this.constructedObject['email'] = this.users[users_index].email;
    }
  }

  disableEditMode() {
    this.editObject = null;
  }

  // checks if user is in users array by name
  nameInUserList(user_name) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].name === user_name) {
        return true;
      }
    }
    return false;
  }

  // gets index of user in users array by name
  indexOfUser(user_name) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].name === user_name) {
        return i;
      }
    }
    return -1;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openAddUsersDialog() {
    const dialogRef = this.dialog.open(AddUsersComponent);

    const instance = dialogRef.componentInstance;
    instance.users = this.users;
    instance.postsService = this.postsService;
    // instance.dialogContent = this.deleteDialogContentSubstring + user_name + '?';

    dialogRef.afterClosed().subscribe(result => {
      if (instance.successfully_added_users) {
        this.users = instance.resulting_users_array;
        this.createAndSortData();
        const snackBarRef = this.snackBar.open('Users (' + instance.users_to_add_count + ') successfully added.', 'Close', {
          duration: 2000
        });
      }
    });
  }

  removeUser(user_name) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    const instance = dialogRef.componentInstance;
    instance.dialogContent = this.deleteDialogContentSubstring + user_name + '?';

    dialogRef.afterClosed().subscribe(result => {
      const isConfirmed = instance.isConfirmed;
      if (isConfirmed) {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].name === user_name) {
            index = i;
          }
        }
        if (index > -1) {
          this.users.splice(index, 1);
          this.createAndSortData();
          this.setUsers();
        } else {
          console.log('user ' + user_name + ' not found');
          console.log(this.users);
        }
      }
    });
  }

  setUsers() {
    this.postsService.setUsers({'users': this.users}).subscribe(res => {
      // console.log('users set');
    });
  }

  createElement(user) {
    const newObj = {};
    newObj['name'] = user['name'];
    newObj['email'] = user['email'];
    return newObj;
  }

}

function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
}
