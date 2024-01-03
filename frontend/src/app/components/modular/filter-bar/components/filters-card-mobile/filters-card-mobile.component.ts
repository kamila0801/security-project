import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BaseComponent} from "../../../../global/base/base-component";
import {Filter, FilterItem, FilterType} from "../../interfaces/filter.interface";
import {FormControlNames} from "../../../../../constants/formControlNames";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {DateRange} from "@angular/material/datepicker";

@Component({
  selector: 'app-filters-card-mobile',
  templateUrl: './filters-card-mobile.component.html'
})
export class FiltersCardMobileComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('FILTERS_VIEW') FILTERS_VIEW_TEMPLATE: TemplateRef<any>;
  @ViewChild('OPEN_FILTER') OPEN_FILTER_TEMPLATE: TemplateRef<any>;
  currentView: TemplateRef<any>;

  @Input() filtersArray: Filter[] = [];
  selectedFilter: Filter | undefined; // filter selected to show in open filter view
  displayFormGroup: FormGroup;

  @Output() applyFiltersEmitter = new EventEmitter<any>();
  @Output() closeFiltersEmitter = new EventEmitter<any>();


  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }
  ngOnInit() {
    this.createFormGroup();
  }

  ngAfterViewInit() {
    this.currentView = this.FILTERS_VIEW_TEMPLATE;
    this.cdr.detectChanges();
  }

  createFormGroup() {
    this.displayFormGroup = this.fb.group({});
    this.filtersArray.forEach(filter => {
      const value = this.determineDisplayValue(filter);
      this.displayFormGroup.addControl(filter.label, new FormControl({value: value, disabled: true}));
      filter.formControl.valueChanges.subscribe((change) => {
        this.updateDisplayFormGroup();
      })
    });

    console.log(this.displayFormGroup.value);
  }

  updateDisplayFormGroup() {
    this.filtersArray.forEach(filter => {
      const value = this.determineDisplayValue(filter);
      this.displayFormGroup.get(filter.label)?.setValue(value);
    });
  }

  determineDisplayValue(filter: Filter) {
    switch (filter.type) {
      case FilterType.SINGLE_SELECTION: return filter.formControl.value.label;
      case FilterType.MULTI_SELECTION: return filter.formControl.value.map((obj: FilterItem) => obj.label).join(', ');
      case FilterType.DATE: return this.formatDate(filter.formControl.value);
      case FilterType.PRICE_RANGE: return filter.formControl.get(FormControlNames.minPrice)?.value + ' - ' + filter.formControl.get(FormControlNames.maxPrice)?.value
    }
    return '';
  }

  formatDate(value: Date | DateRange<any>) {
    if ((value as any).start && (value as any).end) {
      const formattedStartDate = format((value as any).start, 'MMM do yyyy', { locale: enUS });
      const formattedEndDate = format((value as any).end, 'MMM do yyyy', { locale: enUS });
      return `${formattedStartDate} - ${formattedEndDate}`;
    } else if (value) {
      return format((value as Date), 'MMMM do yyyy', { locale: enUS });
    } else return '';
  }

  openFilter(filter: Filter) {
    this.selectedFilter = filter;
    this.currentView = this.OPEN_FILTER_TEMPLATE;
  }

  backToDefaultView() {
    this.selectedFilter = undefined;
    this.currentView = this.FILTERS_VIEW_TEMPLATE;
  }

  isItemActive(item: FilterItem, filter: Filter) {
    switch (filter.type) {
      case FilterType.SINGLE_SELECTION: return filter.formControl.value === item;
      case FilterType.MULTI_SELECTION: return !!filter.formControl.value.find((element: FilterItem) => element.label === item.label);
    }
    return false;
  }

  onItemSelected(item: FilterItem, filter: Filter) {
    if (filter.type === FilterType.SINGLE_SELECTION) {
      filter.formControl.setValue(item);
    } else if (filter.type === FilterType.MULTI_SELECTION) {
      // deselect item
      if (filter.formControl.value.find((element: FilterItem) => element.label === item.label)) {
        filter.formControl.setValue(filter.formControl.value.filter((element: FilterItem) => element.label !== item.label));
      } // select item
      else {
        filter.formControl.setValue(filter.formControl.value.concat(item));
      }
    }
  }

  getDisplayFormControl(item: Filter) {
    return this.displayFormGroup.get(item.label) as FormControl;
  }

}
