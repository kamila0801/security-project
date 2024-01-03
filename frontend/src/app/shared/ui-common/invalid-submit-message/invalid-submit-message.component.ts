import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconComponent} from "../icon/icon.component";

@Component({
  selector: 'app-invalid-submit-message',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './invalid-submit-message.component.html'
})
export class InvalidSubmitMessageComponent implements OnChanges {
  @Input() displayCondition: boolean;

  shouldShow = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.displayCondition && !changes.displayCondition.isFirstChange()) {
      this.shouldShow = changes.displayCondition.currentValue;
    }
  }

  closeMessage(): void {
    this.shouldShow = false;
  }
}
