import { Component, OnInit } from '@angular/core';
import { ColorModeStore } from 'src/app/stores/data-stores/color-mode.store';
import {reaction} from "mobx";
import gsap from "gsap";

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html'
})
export class ToggleComponent {

  constructor(public colorModeStore: ColorModeStore) {
    reaction(
      () => colorModeStore.isDarkMode,
      (isDarkMode) => {
        if (isDarkMode) {
          gsap.to('#color-mode-icon', {
            morphSVG: {shape: '#color-mode-moon', shapeIndex: 'auto'},
            duration: 0.4,
            ease: 'power2.inOut',
          });
        } else {
          gsap.to('#color-mode-icon', {
            morphSVG: {shape: '#color-mode-sun', shapeIndex: 'auto'},
            duration: 0.4,
            ease: 'power2.inOut',
          });
        }
      }, {fireImmediately: true}
    );
  }


}
