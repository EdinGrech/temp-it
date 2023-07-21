import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
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
    public store: Store<{ auth: any; global: any }>,
    private loadingController: LoadingController
  ) {
    this.loading$.subscribe((loading) => {
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
          if (!this.isLoading) {
            res.dismiss();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    this.loadingController
      .dismiss()
  }

  ngOnInit() {}
}
