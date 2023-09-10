import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenDealerService {

  constructor() {}

  // Check if the refresh token is present in the cookie
  isRefreshTokenAvailable(): boolean {
     if(localStorage.getItem('refresh')) return true
     return false;
  }

  // Get the expiration date of the refresh token from the cookie
  getRefreshTokenExpiration(): Date | null {
    const refreshToken = localStorage.getItem('refresh');

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

  getAccessTokenExpiration(): Date | null {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      try {
        // Parse the JWT payload
        const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));

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
    console.log(expirationDate, new Date())
    if (expirationDate) {
      return expirationDate <= new Date();
    }
    return true;
  }

  isAccessTokenExpired(): boolean {
    const expirationDate = this.getAccessTokenExpiration();
    console.log(expirationDate, new Date())
    if (expirationDate) {
      return expirationDate <= new Date();
    }
    return true;
  }

  removeTokens(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  private refreshing = false;

  isRefreshing(): boolean {
    return this.refreshing;
  }

  setRefreshing(refreshing: boolean) {
    this.refreshing = refreshing;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh', refreshToken);
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('access', accessToken);
  }
}
