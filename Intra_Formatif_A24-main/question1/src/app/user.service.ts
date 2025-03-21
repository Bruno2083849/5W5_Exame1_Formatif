import { Injectable } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';

const USER_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  preferCat() {
    if(this.currentUser?.prefercat == false) return true;
    return false;
  }
  currentUser?: User;

  constructor(public route: Router) {
    let userString = localStorage.getItem(USER_KEY);
    if (userString != null) this.currentUser = JSON.parse(userString);
  }

  connect(user: User) {
    this.currentUser = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    this.route.navigate(['/home']);
  }

  disconnect() {
    this.currentUser = undefined;
    localStorage.removeItem(USER_KEY);

    this.route.navigate(['/login']);
    console.log(this.currentUser)
  }
  isLogged(){
    if(this.currentUser == undefined) return false;
    return true;
  }
}
