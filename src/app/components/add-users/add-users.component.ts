import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PostsService } from '../../posts.services';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  users_to_add = [];

  // outputs
  successfully_added_users = false;
  resulting_users_array = [];

  postsService: PostsService;

  @Input() users_to_add_count = 1;

  @Input() users: any[];

  constructor(private dialogRef: MatDialogRef<AddUsersComponent>, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.usersToAddCountChanged();
  }

  userAlreadyExists(user_name) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].name === user_name) { return true; }
    }
    return false;
  }

  canAddUsers() {
    // does checks to see if the list of users are able to be added
    let able_to_add = true;
    for (let i = 0; i < this.users_to_add_count; i++) {
      // tests to see if user already exists by name in the users list
      if (this.userAlreadyExists(this.users_to_add[i].name)) { able_to_add = false; }

      // tests to see if there is whitespace or not in name and email
      if (isEmptyOrSpaces(this.users_to_add[i].name) || isEmptyOrSpaces(this.users_to_add[i].email)) { able_to_add = false; }
    }
    return able_to_add;
  }

  addUsers() {
    let new_users_array: any[];
    const able_to_add = this.canAddUsers();

    if (able_to_add) {
      new_users_array = this.users.concat(this.users_to_add);
      this.setUsers(new_users_array);
      this.clearUsersToAdd();
      this.resulting_users_array = new_users_array;
      this.successfully_added_users = true;
      this.dialogRef.close();
    } else {
      console.log('Failed to add users!');
    }
  }

  setUsers(users_to_set) {
    this.postsService.setUsers({'users': users_to_set}).subscribe(res => {
    });
  }

  clearUsersToAdd() {
    this.users_to_add = [];
    this.usersToAddCountChanged();
  }

  incrementUsersToAddCount() {
    this.users_to_add_count++;
    this.usersToAddCountChanged();
  }

  decrementUsersToAddCount() {
    this.users_to_add_count--;
    this.users_to_add.pop();
    this.usersToAddCountChanged();
  }

  usersToAddCountChanged() {
    // console.log('ran');
    if (this.users_to_add_count > this.users_to_add.length) { // fixes minute options since it's not long enough
      for (let i = 0; i < this.users_to_add_count - this.users_to_add.length; i++) {
        this.users_to_add.push({'name': '', 'email': ''});
      }
    }
  }

}

function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
}
