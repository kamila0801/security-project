import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class BadgeComponent {
  @Input() text: string;
}
