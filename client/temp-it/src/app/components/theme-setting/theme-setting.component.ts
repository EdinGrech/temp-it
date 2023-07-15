import { Component, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import type { QueryList } from '@angular/core';
import { ColorMode, ColorModeService } from 'src/app/services/themer/themer.service';

import type { Animation } from '@ionic/angular';
import { AnimationController, IonSegmentButton, IonSegment } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ThemeSettingComponent  implements AfterViewInit {
  @ViewChildren(IonSegmentButton, { read: ElementRef }) segmentButtonElements!: QueryList<ElementRef<HTMLIonSegmentButtonElement>>;
  private animation!: Animation;

  public colorModes: ColorMode[] = ['auto', 'dark', 'light'];
  public currentColorMode: ColorMode = this.colorMode.getMode();
  public themeIcon?: string;
  public optionsOpen: boolean = false;
  constructor(
    private animationCtrl: AnimationController,
    private colorMode: ColorModeService
    ) { 
      if (this.currentColorMode === 'dark') {
        this.themeIcon = 'moon-outline';
      }
      else{
        this.themeIcon = 'sunny-outline';
      }
     }

     ngAfterViewInit() {
      let animationArray: Animation[] = [];
      const delay = 150;
      const initialOpacity = 0;
  
      // Convert the QueryList to an array
      const segmentButtonArray = this.segmentButtonElements.toArray();
      console.log(segmentButtonArray.length);
  
      for (let i = 0; i < segmentButtonArray.length; i++) {
        const segmentButton = segmentButtonArray[i];
        const animation = this.animationCtrl
          .create()
          .addElement(segmentButton.nativeElement)
          .duration(600 * (i * 0.75))
          .beforeStyles({ 'opacity': initialOpacity, 'display': 'flex', 'overflow': 'hidden' })
          .fromTo('opacity', initialOpacity, 1)
          .afterClearStyles(['width'])
          .afterStyles({ 'overflow': 'visible' });
  
        animation.delay(i * delay);
  
        animationArray.push(animation);
      }
  
      this.animation = this.animationCtrl
        .create()
        .duration(600 + ((segmentButtonArray.length - 1) * delay))
        .easing('ease-out')
        .addAnimation(animationArray);
    }

  async openColorOptions() {
    this.animation.play();
  }

  async toggleThemeOptions(event: any) {
    console.log(this.optionsOpen, 1);
    this.optionsOpen = !this.optionsOpen;
    if (this.optionsOpen) {
      console.log("open?");
     this.openColorOptions();
    } else {
     this.openColorOptions();
    }
  }
  

  async changeColorScheme(event: any) {
    const colorMode = event.detail.value;
    this.colorMode.setMode(colorMode);
    // moon-outline sunny-outline
    if (colorMode === 'dark') {
      this.themeIcon = 'moon-outline';
    }
    else{
      this.themeIcon = 'sunny-outline';
    }
  }


}
