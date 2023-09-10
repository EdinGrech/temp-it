import { Component, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { selectGlobalError } from '../../state/global/global.selectors';
import { selectUserError } from '../../state/user/user.selectors';

import { AlertController } from '@ionic/angular';
import { AppState } from 'src/app/state/app.state';
@Component({
  selector: 'app-alert-handler',
  templateUrl: './alert-handler.component.html',
  styleUrls: ['./alert-handler.component.scss'],
  standalone: true,
})
export class AlertHandlerComponent  implements OnInit {

  globalError$: Observable<HttpErrorResponse> = this.store.select(selectGlobalError);
  error$: Observable<HttpErrorResponse> = this.store.select(selectUserError);

  private globalErrorSubscription?: Subscription;
  private errorSubscription?: Subscription;

  private isAlertDisplayed = false;

  constructor(
    public store: Store<AppState>,
    private alertController: AlertController ) {}

  ngOnInit() {
    this.globalErrorSubscription = this.globalError$.subscribe((error: HttpErrorResponse) => {
      if (error && !this.isAlertDisplayed) {
        let errorText: string = '';
        if (error.error.detail) {
          error.error.detail.forEach((errorObj: { value: string }) => {
            errorText = errorText + ' ' + errorObj.value;
          });
        } else if (error.error) {
          errorText = error.error.error;
        } else {
          errorText = 'Something went wrong! Please try again!';
        }
        this.presentAlert('Error', errorText);
      }
    });

    this.errorSubscription = this.error$.subscribe((error: HttpErrorResponse) => {
      if (error && !this.isAlertDisplayed) {
        let errorText: string = '';
        if (error.error.detail) {
          // check if error is an array of objects
          if (Array.isArray(error.error.detail)) {
            error.error.detail.forEach((errorObj: { value: string }) => {
              errorText = errorText + ' ' + errorObj.value;
            });
          } else {
            errorText = error.error.detail;
          }
        } else if (error.error) {
          errorText = error.error.error;
        } else {
          errorText = 'Something went wrong! Please try again!';
        }
        this.presentAlert('Error', 'Something went wrong! ' + errorText + ' Please try again!');
      }
    });
  
    // --- to convert potentially ---
    // this.user$.subscribe((user$: User) => {
    //   if (user$.username && user$.email) {
    //     this.alertHeader = 'Success';
    //     this.alertMessage = 'You have successfully registered! Login to continue';
    //     this.alertButtons = [
    //       {
    //         text: 'Ok',
    //         handler: () => {
    //           this.screen = 'signin';
    //           this.setAlertOpen(false);
    //         },
    //       },
    //     ];
    //     this.setAlertOpen(true);
    //   }
    // });
    // this.forgotPskProcess$.subscribe((forgotPskProcess$: any) => {
    //   if (forgotPskProcess$) {
    //     if (forgotPskProcess$.error) {
    //       this.alertHeader = 'Error';
    //       this.alertMessage = forgotPskProcess$.error;
    //       this.alertButtons = [
    //         {
    //           text: 'Ok',
    //           handler: () => {
    //             this.setAlertOpen(false);
    //           },
    //         },
    //       ];
    //       this.setAlertOpen(true);
    //     }
    //     else if (forgotPskProcess$.success) {
    //       this.alertHeader = 'Success';
    //       this.alertMessage = forgotPskProcess$.success;
    //       this.alertButtons = [
    //         {
    //           text: 'Ok',
    //           handler: () => {
    //             this.screen = 'signin';
    //             this.setAlertOpen(false);
    //           },
    //         },
    //       ];
    //       this.setAlertOpen(true);
    //     }
    //   }
    // });
  }

  ngOnDestroy() {
    if(this.globalErrorSubscription){
      this.globalErrorSubscription.unsubscribe();
    }
    if(this.errorSubscription){
      this.errorSubscription.unsubscribe();
    }
  }

  async presentAlert(header: string, message: string): Promise<void> {
    this.isAlertDisplayed = true;

    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();

    await alert.onDidDismiss();
    this.isAlertDisplayed = false;
  }
  
}
