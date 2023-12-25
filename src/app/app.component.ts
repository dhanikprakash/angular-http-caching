import { Component } from '@angular/core';
import { UserService } from './user.service';
import { users } from './users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchTerm: string = '';
  users: users[] = [];

  constructor(private userSerice: UserService) { }

  search() {
    this.users = [];
    this.userSerice.getUsername(this.searchTerm).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching username:', error);
      }
    );
  }
}
