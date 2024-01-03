import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {AnimationItem} from "lottie-web";

@Component({
  selector: 'app-scroll-loader',
  templateUrl: './scroll-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollLoaderComponent {
  options: AnimationOptions = {
    path: '/assets/lottie/scroll-loader.json'
  };

  animationCreated(animationItem: any): void {
    animationItem.setSpeed(0.75);
  }

}
