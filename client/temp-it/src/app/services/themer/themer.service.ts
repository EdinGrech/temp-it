import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ColorMode = 'auto' | 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ColorModeService {
  /**
   * Variable that controls the user interface. Used to toggle 'dark-theme' class.
   */
  public darkMode$ = new BehaviorSubject<boolean>(false);

  // Check user preference for light/dark theme
  private prefDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Set user preferred mode on refresh.
    this.setMode(this.getMode());

    // Change between light/dark theme based on device settings
    if (this.getMode() === 'auto') {
      this.darkMode$.next(this.prefDark.matches);
      this.listenToColorModeChanges();
    }
  }

  private applyColorModeChanges = (event: any) => {
    this.darkMode$.next(event.matches);
  };

  private listenToColorModeChanges() {
    this.prefDark.addEventListener('change', this.applyColorModeChanges);
  }

  private removeColorModeChangesListener() {
    this.prefDark.removeEventListener('change', this.applyColorModeChanges);
  }

  /**
   * Set user preferred color mode.
   */
  setMode = (colorMode: ColorMode) => {
    localStorage.setItem('mode', colorMode);

    switch (colorMode) {
      case 'auto':
        this.darkMode$.next(this.prefDark.matches);
        this.listenToColorModeChanges();
        break;

      case 'dark':
        this.darkMode$.next(true);
        this.removeColorModeChangesListener();
        break;

      case 'light':
        this.darkMode$.next(false);
        this.removeColorModeChangesListener();
        break;

      default:
        break;
    }
  };

  /**
   * Get user preferred color mode.
   */
  getMode = (): ColorMode => {
    // Get user preferred mode from localStorage and if not set return default
    return (localStorage.getItem('mode') as ColorMode) ?? 'auto';
  };
}
