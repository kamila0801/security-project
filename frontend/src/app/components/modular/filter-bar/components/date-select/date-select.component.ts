import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY
} from "@angular/material/datepicker";
import {BaseComponent} from "../../../../global/base/base-component";

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    }
  ]
})
export class DateSelectComponent extends BaseComponent {

  @Input() dateFormControl: FormControl;
  isSelectRange = false;

  onDateSelected(date: Date) {
    if (!this.isSelectRange) {
      this.dateFormControl.setValue(date);
    } else {
      const selectedDateRange = this.dateFormControl.value;
      if (
        selectedDateRange &&
        selectedDateRange.start &&
        date > selectedDateRange.start &&
        !selectedDateRange.end
      ) {
        this.dateFormControl.setValue(new DateRange(
          selectedDateRange.start,
          date
        ));
      } else {
        this.dateFormControl.setValue(new DateRange(date, null));
      }
    }
  }
}
