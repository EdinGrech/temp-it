import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { selectUserLoading } from 'src/app/state/user/user.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from 'src/app/state/app.state';

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
  loadingTimeout: number = 5000; // Adjust the timeout duration (in milliseconds) as needed.

  constructor(
    public store: Store<AppState>,
    private loadingController: LoadingController,
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
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    // Show the loading controller
    await loading.present();

    // Set a timeout to dismiss the loading controller automatically
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.loadingTimeout);
    });

    // Wait for either the timeout to be reached or isLoading to become false
    await Promise.race([timeoutPromise, this.dismissManualLoading(loading)]);
  }

  async dismissLoading() {
    this.isLoading = false;
    if (this.loadingController) {
      await this.loadingController.dismiss().catch((error) => {});
    }
  }

  async dismissManualLoading(loading: HTMLIonLoadingElement): Promise<void> {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!this.isLoading) {
          loading.dismiss().then(() => {
            clearInterval(interval);
            resolve();
          });
        }
      }, 100);
    });
  }

  ngOnInit() {}
}
