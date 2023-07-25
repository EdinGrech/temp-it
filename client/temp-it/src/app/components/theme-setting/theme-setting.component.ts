import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import type { QueryList } from '@angular/core';
import {
  ColorMode,
  ColorModeService,
} from 'src/app/services/themer/themer.service';

import type { Animation } from '@ionic/angular';
import {
  AnimationController,
  IonSegmentButton,
  IonSegment,
} from '@ionic/angular';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ThemeSettingComponent implements AfterViewInit {
  @ViewChildren(IonSegmentButton, { read: ElementRef })
  segmentButtonElements!: QueryList<ElementRef<HTMLIonSegmentButtonElement>>;
  private animationOpen!: Animation;
  private animationClose!: Animation;

  public colorModes: ColorMode[] = ['auto', 'dark', 'light'];
  public currentColorMode: ColorMode = this.colorMode.getMode();
  public themeIcon?: string;
  public optionsOpen: boolean = true;
  constructor(
    private animationCtrl: AnimationController,
    private colorMode: ColorModeService,
  ) {
    this.colorMode.darkMode$.subscribe((darkMode) => {
      if (darkMode) {
        this.themeIcon = 'sunny-outline';
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        this.themeIcon = 'moon-outline';
        document.documentElement.removeAttribute('data-theme');
      }
    });
  }

  ngAfterViewInit() {
    const delay = 150;
    const initialOpacity = 0;
    const segmentButtonArray = this.segmentButtonElements.toArray();
    
    let leftToRightAnimationArray: Animation[] = [];
    let rightToLeftAnimationArray: Animation[] = [];

    for (let i = 0; i < segmentButtonArray.length; i++) {
      const segmentButton = segmentButtonArray[i];

      const leftToRightAnimation = this.animationCtrl
        .create()
        .addElement(segmentButton.nativeElement)
        .duration(600 * (i * 0.75))
        .fromTo('opacity', initialOpacity, 1)
        .fromTo('visibility', 'hidden', 'visible')
        .afterStyles({ overflow: 'visible' });

      leftToRightAnimation.delay(i * delay);

      leftToRightAnimationArray.push(leftToRightAnimation);

      const rightToLeftAnimation = this.animationCtrl
        .create()
        .addElement(segmentButton.nativeElement)
        .duration(600 * ((segmentButtonArray.length - 1 - i) * 0.75))
        .fromTo('opacity', 1, initialOpacity)
        .afterStyles({ overflow: 'hidden', visibility: 'hidden' });

      rightToLeftAnimation.delay((segmentButtonArray.length - 1 - i) * delay);

      rightToLeftAnimationArray.push(rightToLeftAnimation);
    }

    this.animationOpen = this.animationCtrl
      .create('open-animation')
      .duration(600 + (segmentButtonArray.length - 1) * delay)
      .easing('ease-out')
      .addAnimation(leftToRightAnimationArray);

    this.animationClose = this.animationCtrl
      .create('close-animation')
      .duration(600 + (segmentButtonArray.length - 1) * delay)
      .easing('ease-out')
      .addAnimation(rightToLeftAnimationArray);
  }

  public disableToggle: boolean = false;
  async toggleThemeOptions(event: any) {
    if (this.disableToggle) {
      return;
    }
    this.disableToggle = true;
    this.optionsOpen = !this.optionsOpen;
    if (!this.optionsOpen) {
      this.animationOpen.stop(); // Stop the animation to reset it
      this.animationOpen.play();
    } else {
      this.animationClose.stop(); // Stop the animation to reset it
      this.animationClose.play();
    }
    //wait for animation to finish
    await new Promise((resolve) => setTimeout(resolve, 600));
    this.disableToggle = false;
  }

  async changeColorScheme(event: any) {
    const colorMode = event.detail.value;
    this.colorMode.setMode(colorMode);
  }
}
