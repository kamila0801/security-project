import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldSizes } from 'src/app/constants/genericTypes';
import {BaseComponent} from '../../global/base/base-component';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styles: [`:host {width: 100%;}`] // makes the input field expand into its parent
})
export class TextFieldComponent extends BaseComponent implements OnInit {

  @Input() placeholder: string | undefined;
  @Input() formGroupToUse: FormGroup;
  @Input() formControlNameToUse: string;
  @Input() size: FieldSizes = FieldSizes.MEDIUM;
  @Input() greyBackground: boolean = false; //from default background is white
  @Input() maxLength: number | null = null;

  constructor() { super() }

  ngOnInit(): void {
  }

}
