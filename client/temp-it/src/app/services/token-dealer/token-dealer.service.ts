import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenDealerService {

  constructor(private cookieService: CookieService) {}

  // Check if the refresh token is present in the cookie
  isRefreshTokenAvailable(): boolean {
    return this.cookieService.check("refresh");
  }

  // Get the expiration date of the refresh token from the cookie
  getRefreshTokenExpiration(): Date | null {
    const refreshToken = this.cookieService.get("refresh");

    if (refreshToken) {
      try {
        // Parse the JWT payload
        const jwtPayload = JSON.parse(atob(refreshToken.split('.')[1]));

        // Check if the payload has an 'exp' (expiration) field
        if (jwtPayload && jwtPayload.exp) {
          // Convert the 'exp' timestamp to a Date object
          return new Date(jwtPayload.exp * 1000);
        }
      } catch (error) {
        console.error('Error decoding or parsing JWT:', error);
      }
    }

    return null;
  }

  // Check if the refresh token is expired
  isRefreshTokenExpired(): boolean {
    const expirationDate = this.getRefreshTokenExpiration();
    if (expirationDate) {
      console.log(expirationDate <= new Date());
      return expirationDate <= new Date();
    }
    return true; // If there's no expiration date, consider it expired
  }
}
