import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorModeService } from '../../services/themer/themer.service';
import { User } from '../../interfaces/user';

import { ThemeSettingComponent } from '../../components/theme-setting/theme-setting.component';

import {
  selectUserLoading,
  selectUserUser,
  selectUserLoggedIn,
  forgotUserPasswordStatus,
} from '../../state/user/user.selectors';

import { forgotUserPassword, loginUser, registerUser } from '../../state/user/user.actions';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from 'src/app/state/app.state';

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
  ],
})
export class AuthPage implements OnInit {
  screen: Screen = 'signin';
  loginFormData: FormGroup;
  signUpFormData: FormGroup;
  forgotPasswordFormData: FormGroup;

  user$: Observable<User> = this.store.select(selectUserUser);
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  loggedIn$: Observable<boolean> = this.store.select(selectUserLoggedIn);
  forgotPskProcess$: Observable<any> = this.store.select(forgotUserPasswordStatus);

  constructor(
    public colorMode: ColorModeService,
    private fb: FormBuilder,
    public store: Store<AppState>,
    private router: Router
  ) {
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
}
