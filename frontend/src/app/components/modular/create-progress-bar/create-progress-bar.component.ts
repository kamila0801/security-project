import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseComponent} from '../../global/base/base-component';

@Component({
  selector: 'app-create-progress-bar',
  templateUrl: './create-progress-bar.component.html'
})
export class CreateProgressBarComponent extends BaseComponent{

  @Input() items: any[] = [];
  @Output() goTo = new EventEmitter()
  selectedIndex: number = 0;
  isAnimating: boolean = false;

  select(index: number) {
    this.isAnimating = true;
    setTimeout(() => {
      this.selectedIndex = index;
      this.isAnimating = false;
    }, 500); // Match this to your CSS transition duration
  }

  next(test: any) {
    debugger
    console.log(test)
    if (this.selectedIndex < this.items.length - 1) {
      this.select(this.selectedIndex + 1);
    }
  }
}
