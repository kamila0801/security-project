import { Component, Input, OnInit } from '@angular/core';
import {BaseComponent} from '../../global/base/base-component';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-btn.component.html'
})
export class IconBtnComponent extends BaseComponent implements OnInit {

  @Input() iconName: string | undefined;
  @Input() isBackground: boolean = true;
  // TODO SHOULD BE TYPE
  @Input() backgroundColor: string = 'bg-white';
  @Input() isWhiteIcon: boolean = false;
  @Input() tabIndex: number = 0;

  constructor() { super() }

  ngOnInit(): void {
  }

}
