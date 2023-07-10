import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { User } from '../interfaces/user';

import {
  selectUserLoading,
  selectUserUser,
  selectUserError,
  selectUserLoggedIn,
} from '../state/user/user.selectors';
import { loginUser, registerUser } from '../state/user/user.actions';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuthPage implements OnInit {
  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;

  user$: Observable<User> = this.store.select(selectUserUser);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  error$: any = this.store.select(selectUserError);
  errorDescription: string = '';
  loggedIn$: Observable<boolean> = this.store.select(selectUserLoggedIn);

  constructor(
    private fb: FormBuilder,
    public store: Store<{ auth: any; news: any; post:any }>,
    private router: Router
  ) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.user$.subscribe((user$: User) => {
      this.isLoading = false;
      console.log(user$, this.error$);
      if(user$ && this.error$ == null){
        this.alertHeader = 'Success';
        this.alertMessage = 'You have successfully registered!';
        this.alertButtons = [
          {
            text: 'Ok',
            handler: () => {
              this.screen = 'signin';
              this.setAlertOpen(false);
            },
          },
        ];
        this.setAlertOpen(true);
      }
    });
    this.loggedIn$.subscribe((loggedIn: boolean) => {
      console.log(loggedIn, this.isLoading);
      if (loggedIn == true && this.isLoading == false) {
        this.isLoading = false;
        this.router.navigate(['/news']);
      }
    });
    this.error$.subscribe((error: any) => {
      this.isLoading = false;
      if(error){
        for (const [key, value] of Object.entries(error.error)) {
          this.errorDescription = this.errorDescription + value + ' ';
        }
        this.alertHeader = 'Error';
        this.alertMessage = 'Something went wrong! ' + this.errorDescription + 'Please try again!';
        this.alertButtons = [
          {
            text: 'Ok',
            handler: () => {
              this.setAlertOpen(false);
            }
          }
        ];
        this.setAlertOpen(true);
      }
    });
  }

  ngOnInit() {}

  change(event: any) {
    this.screen = event;
  }

  login() {
    let formData_: any = new FormData();
    this.isLoading = true;
    formData_.append('email', this.formData.get('email')!.value);
    formData_.append('password', this.formData.get('password')!.value);
    this.store.dispatch(
      loginUser({
        email: formData_.get('email'),
        password: formData_.get('password'),
      })
    );
  }

  register() {
    var formData: any = new FormData();
    if (this.formData.valid) {
      this.isLoading = true;
      formData.append('name', this.formData.get('name')!.value);
      formData.append('email', this.formData.get('email')!.value);
      formData.append('password', this.formData.get('password')!.value);

      this.store.dispatch(
        registerUser({
          username: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
        })
      );
    }
  }

  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';
  alertButtons: any;

  setAlertOpen(value: boolean) {
    this.isAlertOpen = value;
  }
}
