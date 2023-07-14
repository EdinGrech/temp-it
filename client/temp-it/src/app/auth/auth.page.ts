import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorModeService } from '../services/themer/themer.service';
import { User } from '../interfaces/user';

import { ThemeSettingComponent } from '../components/theme-setting/theme-setting.component';

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

export type Screen = 'signin'|'signup'| 'forget';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, ThemeSettingComponent],
})

export class AuthPage implements OnInit {
  screen: Screen = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;

  user$: Observable<User> = this.store.select(selectUserUser);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  error$: any = this.store.select(selectUserError);
  errorDescription: string = '';
  loggedIn$: Observable<boolean> = this.store.select(selectUserLoggedIn);

  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';
  alertButtons: any;
  
  constructor(
    public colorMode: ColorModeService,
    private fb: FormBuilder,
    public store: Store<{ auth: any;}>,
    private router: Router
  ) {
    colorMode.darkMode$.subscribe((darkMode) => {
      //select app root and add/remove dark class
      if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        //document.body.classList.remove('light');
      } else {
        //document.body.classList.add('light');
        document.documentElement.removeAttribute('data-theme');
      }
    });
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.user$.subscribe((user$: User) => {
      this.isLoading = false;
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

  change(event: Screen) {
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

  setAlertOpen(value: boolean) {
    this.isAlertOpen = value;
  }
}
