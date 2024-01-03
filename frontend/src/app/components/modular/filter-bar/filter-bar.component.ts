import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {BaseComponent} from '../../global/base/base-component';
import {Filter, FilterType} from "./interfaces/filter.interface";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarComponent extends BaseComponent implements OnInit {

  @Output() applyFiltersEmitter = new EventEmitter<any>();
  @Input() filtersArray: Filter[];
  areFiltersOpen = false;


  constructor(
    private cdr: ChangeDetectorRef
  ) { super() }

  ngOnInit() {
    if (this.filtersArray.find(filter => filter.type === FilterType.TEXT_SEARCH)) {
      this.filtersArray.find(filter => filter.type === FilterType.TEXT_SEARCH)!.formControl.valueChanges.subscribe((val) => {
        this.applyFiltersEmitter.emit();
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.cdr.detectChanges();
  }

  get getTextSearchFilter(): Filter | undefined {
    return this.filtersArray.find(filter => filter.type === FilterType.TEXT_SEARCH);
  }

  get filtersWithoutTextSearch(): Filter[] {
    return this.filtersArray.filter(filter => filter.type !== FilterType.TEXT_SEARCH);
  }

  onFiltersApplied() {
    this.applyFiltersEmitter.emit();
    this.areFiltersOpen = false;
    this.cdr.detectChanges();
  }
}
