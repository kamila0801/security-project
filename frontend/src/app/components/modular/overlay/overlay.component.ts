import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html'
})
export class OverlayComponent {

  @Output() onClickEmitter: EventEmitter<any> = new EventEmitter;

}
