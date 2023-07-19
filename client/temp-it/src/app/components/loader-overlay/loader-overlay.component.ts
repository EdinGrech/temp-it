import { Component, OnInit } from '@angular/core';
//import loading spinner component
import { IonicModule, LoadingController } from '@ionic/angular';
//import store
import { Store } from '@ngrx/store';
//import user state
import { selectUserLoading } from 'src/app/state/user/user.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader-overlay',
  templateUrl: './loader-overlay.component.html',
  styleUrls: ['./loader-overlay.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LoaderOverlayComponent implements OnInit {
  loading$: Observable<boolean> = this.store.select(selectUserLoading);
  isLoading: boolean = false;
  constructor(
    public store: Store<{ auth: any }>,
    private loadingController: LoadingController
  ) {
    this.loading$.subscribe((loading) => {
      console.log('loading', loading);
      //set timeout to allow for loading to be set to true before showing
      setTimeout(() => {
        if (loading) {
          this.presentLoading();
        } else {
          this.dismissLoading();
        }
      }, 0);
    });
  }

  async presentLoading() {
    this.isLoading = true;
    this.loadingController
      .create({
        message: 'Please wait...',
      })
      .then((res) => {
        res.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            res.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    this.loadingController
      .dismiss()
      .then((res) => {
        console.log('Loading dismissed!', res);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  ngOnInit() {}
}
