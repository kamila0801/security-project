import {DateRange} from "@angular/material/datepicker";
import {SortByEnum, SortOrderEnum} from "../../constants/sortingConstants";
import {CategoryDTO} from "../dtos/categoryDTO";

export interface EventsFilters {
  sortBy?: SortByEnum,
  sortOrder?: SortOrderEnum,
  category?: CategoryDTO[],
  textSearch?: string,
  minPrice?: number,
  maxPrice?: number,
  organisationId?: number,
  date?: Date | DateRange<any>
}
