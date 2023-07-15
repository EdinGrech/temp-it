import { Component, OnInit } from '@angular/core';
import { ColorMode, ColorModeService } from 'src/app/services/themer/themer.service';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ThemeSettingComponent  implements OnInit {

  public colorModes: ColorMode[] = ['auto', 'dark', 'light'];
  public currentColorMode: ColorMode = this.colorMode.getMode();
  public themeIcon?: string;
  public optionsOpen: boolean = false;
  constructor(
    private colorMode: ColorModeService
    ) { 
      if (this.currentColorMode === 'dark') {
        this.themeIcon = 'moon-outline';
      }
      else{
        this.themeIcon = 'sunny-outline';
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

  async toggleThemeOptions(event: any) {
    this.optionsOpen = !this.optionsOpen;
  }

  ngOnInit() {}

}
