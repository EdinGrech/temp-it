import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

//services
import { AuthService } from './services/auth/auth.service';
import { ColorModeService } from './services/themer/themer.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';

import { userAuthReducer } from './state/user/user.reducer';
import { UserEffects } from './state/user/user.effects';

import { globeReducer as globeReducer } from './state/global/global.reducer';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
import { HttpHeaddersInterceptor } from './interceptors/http-headders.interceptor';

import { LoaderOverlayComponent } from './components/loader-overlay/loader-overlay.component';
import { AlertHandlerComponent } from './components/alert-handler/alert-handler.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({ auth: userAuthReducer, global: globeReducer }),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
    LoaderOverlayComponent, 
    AlertHandlerComponent
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpHeaddersInterceptor, multi: true},
    AuthService,
    ColorModeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
