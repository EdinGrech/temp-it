import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorModeService } from '../../services/themer/themer.service';
import { User } from '../../interfaces/user';

import { ThemeSettingComponent } from '../../components/theme-setting/theme-setting.component';
import { LoaderOverlayComponent } from '../../components/loader-overlay/loader-overlay.component';

import {
  selectUserLoading,
  selectUserUser,
  selectUserError,
  selectUserLoggedIn,
  forgotUserPasswordStatus,
} from '../../state/user/user.selectors';

import { selectGlobalError } from '../../state/global/global.selectors';
import { forgotUserPassword, loginUser, registerUser } from '../../state/user/user.actions';

import { Store } from '@ngrx/store';
import { Observable, first } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

export type Screen = 'signin' | 'signup' | 'forget';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeSettingComponent,
    LoaderOverlayComponent,
  ],
})
export class AuthPage implements OnInit {
  screen: Screen = 'signin';
  loginFormData: FormGroup;
  signUpFormData: FormGroup;
  forgotPasswordFormData: FormGroup;

  globalError$: Observable<HttpErrorResponse> = this.store.select(selectGlobalError);

  user$: Observable<User> = this.store.select(selectUserUser);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  error$: any = this.store.select(selectUserError);
  errorDescription: string = '';
  loggedIn$: Observable<boolean> = this.store.select(selectUserLoggedIn);
  forgotPskProcess$: Observable<any> = this.store.select(forgotUserPasswordStatus);

  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';
  alertButtons: any;

  constructor(
    public colorMode: ColorModeService,
    private fb: FormBuilder,
    public store: Store<{ auth: any; global: any }>,
    private router: Router
  ) {
    this.globalError$.subscribe((error: HttpErrorResponse) => {
      if (error) {
        let errorText: string = '';
        if (error.error.detail) {
          error.error.detail.forEach((errorObj: { value: string; }) => {
            errorText = errorText + ' ' + errorObj.value;
          }); 
        } else if (error.error) {
          errorText = error.error.error;
        } else {
          errorText = 'Something went wrong! Please try again!';
        }
        this.alertHeader = 'Error';
        this.alertMessage = errorText;
        this.alertButtons = [
          {
            text: 'Ok',
            handler: () => {
              this.setAlertOpen(false);
            },
          },
        ];
        this.setAlertOpen(true);
      }
    });
    this.error$.subscribe((error: HttpErrorResponse) => {
      let errorText: string = '';
        if (error.error.detail) {
          error.error.detail.forEach((errorObj: { value: string; }) => {
            errorText = errorText + ' ' + errorObj.value;
          }); 
        } else if (error.error) {
          errorText = error.error.error;
        } else {
          errorText = 'Something went wrong! Please try again!';
        }
        this.alertHeader = 'Error';
        this.alertMessage =
          'Something went wrong! ' +
          errorText +
          'Please try again!';
        this.alertButtons = [
          {
            text: 'Ok',
            handler: () => {
              this.setAlertOpen(false);
            },
          },
        ];
        this.setAlertOpen(true);
      
    });
    this.signUpFormData = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loginFormData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.forgotPasswordFormData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.user$.subscribe((user$: User) => {
      if (user$.username && user$.email) {
        this.alertHeader = 'Success';
        this.alertMessage = 'You have successfully registered! Login to continue';
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
    this.forgotPskProcess$.subscribe((forgotPskProcess$: any) => {
      if (forgotPskProcess$) {
        if (forgotPskProcess$.error) {
          this.alertHeader = 'Error';
          this.alertMessage = forgotPskProcess$.error;
          this.alertButtons = [
            {
              text: 'Ok',
              handler: () => {
                this.setAlertOpen(false);
              },
            },
          ];
          this.setAlertOpen(true);
        }
        else if (forgotPskProcess$.success) {
          this.alertHeader = 'Success';
          this.alertMessage = forgotPskProcess$.success;
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
      }
    });
    this.loggedIn$.subscribe(async (loggedIn: boolean) => {
      if (loggedIn) {
        this.router.navigate(['/tabs']);
      }
    });
  }

  ngOnInit() {}

  change(event: Screen) {
    this.screen = event;
  }

  login() {
    let formData_: any = new FormData();
    if (this.loginFormData.valid) {
      formData_.append('email', this.loginFormData.get('email')!.value);
      formData_.append('password', this.loginFormData.get('password')!.value);
      this.store.dispatch(
        loginUser({
          email: formData_.get('email'),
          password: formData_.get('password'),
        })
      );
    } else {
      this.loginFormData.markAllAsTouched();
    }
  }

  register() {
    let formData: any = new FormData();
    if (this.signUpFormData.valid) {
      formData.append('name', this.signUpFormData.get('name')!.value);
      formData.append('email', this.signUpFormData.get('email')!.value);
      formData.append('password', this.signUpFormData.get('password')!.value);

      this.store.dispatch(
        registerUser({
          username: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
        })
      );
    } else {
      this.signUpFormData.markAllAsTouched();
    }
  }

  forgotPassword() {
    if (this.forgotPasswordFormData.valid) {
      this.store.dispatch(
        forgotUserPassword({
          email: this.forgotPasswordFormData.get('email')!.value,
        })
      );
    } else {
      this.forgotPasswordFormData.markAllAsTouched();
    }
  }
  setAlertOpen(value: boolean) {
    this.isAlertOpen = value;
  }
}
