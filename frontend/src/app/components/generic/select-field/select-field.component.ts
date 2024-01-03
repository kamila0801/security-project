import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {FieldSizes} from 'src/app/constants/genericTypes';
import {BaseComponent} from '../../global/base/base-component';
import {MatSelect} from "@angular/material/select";
import {SortOrderEnum} from "../../../constants/sortingConstants";

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host {width: 100%;}`] // makes the input field expand into its parent
})
export class SelectFieldComponent extends BaseComponent implements OnInit, AfterViewInit {

  /**
   * This input determines whether 'All' option should appear as the first one in the list.
   *
   * If true, the 'All' option will be present it value is equal to '' in terms of reacting to in the formgroup.
   * If false, the 'All' option will not be present.
   */
  @Input() shouldShowAllOption: boolean = false;

  @Input() shouldIncludeOrder: boolean = false;

  @Input() shouldSearchBeEnabled: boolean = false;


  @Input() label: string | undefined;
  @Input() placeholder: string = "";
  @Input() formControlToUse: FormControl;
  @Input() size: FieldSizes = FieldSizes.MEDIUM;
  @Input() list: any[] = [];


  @Input() itemValue: string | undefined;
  @Input() displayValue: string | undefined;

  @ViewChild('select') select: MatSelect;

  searchControl: FormControl;

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.searchControl = new FormControl('');
  }

  ngAfterViewInit() {
  }

  public isFieldRequired() {
    return this.formControlToUse && this.formControlToUse!.hasValidator(Validators.required);
  }

  get getFilteredList() {
    const searchValue = this.searchControl.value;
    return searchValue ? this.filterList(searchValue, this.list) : this.list;
  }

  filterList(searchValue: string, listToSearch: any[]) {
    const lowerSearchValue = searchValue.toLowerCase();

    return listToSearch.filter(item =>
      this.displayValue
        ? item[this.displayValue]?.toLowerCase().includes(lowerSearchValue)
        : item.toLowerCase().includes(lowerSearchValue)
    );
  }

  test(event: any) {
    console.log(event)
  }

  onClickTest(event: any) {
    if (!event.isUserInput) {
      return;
    }
    if (this.shouldIncludeOrder) {
      switch (this.formControlToUse.value.sortOrder) {
        case SortOrderEnum.DESC:
          this.formControlToUse.patchValue({ ...this.formControlToUse.value, sortOrder: SortOrderEnum.ASC });
          //this.select.open();
          console.log(this.formControlToUse.value)
          break;
        case SortOrderEnum.ASC:
          this.formControlToUse.patchValue({ ...this.formControlToUse.value, sortOrder: SortOrderEnum.DESC });
          //this.select.open();
          console.log(this.formControlToUse.value)
          break;
      }
    }
  }

  compareBySortValue(item1: any, item2: any): boolean {
    if (item1.sortValue) {
      return item1.sortValue === item2.sortValue;
    }
    else {
      return item1 === item2;
    }
  }
}
