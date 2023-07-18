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
export class LoaderOverlayComponent  implements OnInit {

  loading$: Observable<boolean> = this.store.select(selectUserLoading);

  constructor(
    public store: Store<{ auth: any;}>,
    private loadingController: LoadingController
  ) {
    this.loading$.subscribe((loading) => {
      if (loading) {
        this.presentLoading();
      } else {
        this.dismissLoading();
      }
    });
   }

  async presentLoading() {
    this.loadingController.create({
      message: 'Please wait...',
      duration: 2000,
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    }); 
  }

  async dismissLoading() {
    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  ngOnInit() {}

}
