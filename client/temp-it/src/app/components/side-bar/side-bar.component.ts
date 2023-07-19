import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, RangeCustomEvent } from '@ionic/angular';

import { Store } from '@ngrx/store';
//import { User } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';

// import {
//   loadUser,
//   updateUser,
//   logoutUser,
// } from 'src/app/state/user/user.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class SideBarComponent implements OnInit {
  constructor(
    private store: Store<{ auth: any; news: any }>,
    private router: Router,
  ) {}
  //user$: Observable<User> = this.store.select((state) => state.auth.user);
  loggedIn$: Observable<boolean> = this.store.select(
    (state) => state.auth.loggedIn,
  );
  email: string = '';
  username: string = '';
  tollerance!: number;
  ngOnInit() {
    // this.store.dispatch(loadUser());
    // this.user$.subscribe((user: User) => {
    //   this.email = user.email;
    //   this.username = user.username;
    //   this.tollerance = user.news_tollerance;
    // });
  }

  // onIonChange(ev: Event) {
  //   this.tollerance = +(ev as RangeCustomEvent).detail.value;
  //   this.store.dispatch(
  //     updateUser({
  //       user: {
  //         email: this.email,
  //         username: this.username,
  //         news_tollerance: this.tollerance,
  //       },
  //     })
  //   );
  // }

  // logout() {
  //   this.store.dispatch(logoutUser());
  //   this.router.navigate(['/auth']);
  // }
}
