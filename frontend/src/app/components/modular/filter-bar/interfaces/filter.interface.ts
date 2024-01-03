import {FormControl} from "@angular/forms";

export interface Filter {
  label: string,
  items: FilterItem[],
  type: FilterType,
  formControl: FormControl,
  canClear: boolean
}

export enum FilterType {
  SINGLE_SELECTION,
  MULTI_SELECTION,
  DATE,
  PRICE_RANGE,
  TEXT_SEARCH
}

export interface FilterItem {
  label: string,
  value: any
}
