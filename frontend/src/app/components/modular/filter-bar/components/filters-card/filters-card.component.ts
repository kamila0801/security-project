import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Filter, FilterItem, FilterType} from "../../interfaces/filter.interface";
import {BaseComponent} from "../../../../global/base/base-component";

@Component({
  selector: 'app-filters-card',
  templateUrl: './filters-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersCardComponent extends BaseComponent {
  @Input() filtersArray: Filter[] = [];
  @Output() applyFiltersEmitter = new EventEmitter<any>();
  @Output() closeFiltersEmitter = new EventEmitter<any>();


  constructor() {
    super();
  }

  isItemActive(item: FilterItem, filter: Filter) {
    switch (filter.type) {
      case FilterType.SINGLE_SELECTION: return filter.formControl.value === item;
      case FilterType.MULTI_SELECTION: return filter.formControl.value?.find((element: FilterItem) => element.label === item.label);
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

  clearFilter(filter: Filter) {
    if (filter.type === FilterType.MULTI_SELECTION) {
      filter.formControl.setValue([]);
    }
    else filter.formControl.reset();
  }
}
