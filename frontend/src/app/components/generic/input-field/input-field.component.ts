import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { FieldSizes, InputFieldTypes } from 'src/app/constants/genericTypes';
import {BaseComponent} from '../../global/base/base-component';
import {IconNames} from '../../../constants/iconNames';
import {FormControlNames} from '../../../constants/formControlNames';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host {width: 100%;}`] // makes the input field expand into its parent
})
export class InputFieldComponent extends BaseComponent implements OnInit {

  @Input() iconRight: IconNames | undefined;
  @Input() iconLeft: IconNames | undefined;
  @Input() iconRightColor: string = 'text-primary'; //format of the color should be using tailwind structure, ex. 'accent-blue'
  @Input() iconLeftColor: string = 'text-primary';
  @Input() placeholder: string;
  @Input() label: string | undefined;
  @Input() formControlToUse: FormControl | null | undefined;
  @Input() size: FieldSizes = FieldSizes.MEDIUM;
  @Input() type: InputFieldTypes = InputFieldTypes.TEXT;
  @Input() greyBackground: boolean = false; //from default background is white
  @Input() maxLength: number | null = null;
  @Input() marginLeft = false;
  @Input() isMapInput = false;
/*
  @Input() mapInputOptions: AutocompleteOptions = {} as AutocompleteOptions;
*/

  @Output() leftIconClick = new EventEmitter();
  @Output() rightIconClick = new EventEmitter();
  @Output() mapAddressSelected = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) { super() }

  ngOnInit(): void {
    this.formControlToUse?.valueChanges.subscribe(value => {
      this.cdr.detectChanges(); // Manually trigger change detection
    })
  }

  public isFieldRequired() {
    return this.formControlToUse && this.formControlToUse!.hasValidator(Validators.required);
  }

  get isDisabled() {
    return this.formControlToUse && this.formControlToUse.disabled;
  }
}
