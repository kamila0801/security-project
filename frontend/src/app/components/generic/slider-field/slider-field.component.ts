import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BaseComponent} from "../../global/base/base-component";
import {FormControlNames} from "../../../constants/formControlNames";

@Component({
  selector: 'app-slider-field',
  templateUrl: './slider-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFieldComponent extends BaseComponent implements OnInit {

  @Input() minFormControlToUse: FormControl;
  @Input() maxFormControlToUse: FormControl;

  constructor(public cdr: ChangeDetectorRef) {
    super();
  }

  minValue: number;
  maxValue: number;

  ngOnInit(): void {
    this.minValue = this.minFormControlToUse.value;
    this.maxValue = this.maxFormControlToUse.value;

    this.minFormControlToUse.valueChanges.subscribe((value: number) => { if (value) {this.minValue = value } });
    this.maxFormControlToUse.valueChanges.subscribe((value: number) => { if (value) {this.maxValue = value } });
  }

  public onMinValueChange() { this.minFormControlToUse.setValue(this.minValue); }

  public onMaxValueChange() { this.maxFormControlToUse.setValue(this.maxValue); }
}
