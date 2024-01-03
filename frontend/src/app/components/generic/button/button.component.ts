import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {BaseComponent} from '../../global/base/base-component';
import {FieldSizes} from '../../../constants/genericTypes';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent extends BaseComponent implements OnInit {

  @Input() text: string = '';
  @Input() color: string | undefined; //color from acceptable tailwind classes
  @Input() hexColor: string | undefined; //hex format
  @Input() disabled: boolean = false;
  @Input() icon: string | undefined; //icon on the left
  @Input() darkText = false; //FALSE - icon and text are white, TRUE - icon and text are black
  @Input() boldText = true;
  @Input() invertedColors = false; //TRUE - bg color transparent, passed color used for border and text
  @Input() size: FieldSizes = FieldSizes.AUTO;

  @Output() buttonClick = new EventEmitter();

  get bgColorClass(): string {
    return this.invertedColors ? 'bg-transparent' :
      (this.color ? 'bg-' + this.color : '');
  }

  get borderColorClass(): string {
    return this.invertedColors && this.color ? 'border-' + this.color : 'border-transparent';
  }

  get textColorClass(): string {
    return this.invertedColors && this.color ? 'text-' + this.color :
      (this.darkText ? 'text-neutral-black' : 'text-neutral-white');
  }

  constructor() { super() }

  ngOnInit(): void {
  }

}
