import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BaseComponent} from "../../global/base/base-component";
import {FormControlNames} from "../../../constants/formControlNames";
import {InfiniteScrollLoadingStore} from "../../../stores/data-stores/events-infinite-scroll-loading.store";
import {CategoryStore} from "../../../stores/api-stores/category.store";
import {EventsStore} from "../../../stores/api-stores/events.store";
import {IReactionDisposer, reaction} from "mobx";
import {EVENTS_INFINITE_SCROLL_BATCH_SIZE, EVENTS_INFINITE_SCROLL_THRESHOLD} from "./constants/events-inf-scroll-thresholds";
import {InfoCardType} from "./components/event-card/interfaces/card-info-type.interface";
import {Filter, FilterItem, FilterType} from "../filter-bar/interfaces/filter.interface";
import {SortByEnum, SortOrderEnum} from "../../../constants/sortingConstants";
import {EventsFilters} from "../../../interfaces/filters/eventsFilters";


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EventsComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * This input determines whether the filter bar should be present or not.
   *
   * If true, filter bar will be present.
   * If false, filter bar will not.
   */
  @Input() withFilterBar: boolean;

  /**
   * This input adds the ability to specify static filters for the shown events.
   *
   * If defined it will add the specified static filters for every request of events
   * If not defined all filters will be used directly from the filter bar.
   */
  @Input() specificFilters: EventsFilters;

  /**
   * The store instance to manage the state of the infinite scrolling.
   */
  public infLoadStore = new InfiniteScrollLoadingStore(EVENTS_INFINITE_SCROLL_THRESHOLD, EVENTS_INFINITE_SCROLL_BATCH_SIZE);

  /**
   * The form group used to filter the events this one can be effected by the specific filters specified.
   */
  private eventsFormGroup: FormGroup;

  /**
   * The disposer to store and destroy the reaction for the events.
   */
  private eventsReactionDisposer: IReactionDisposer;

  /**
   * Array of filters that will be shown in the filter bar
   */
  public filtersArray: Filter[] = [];

  /**
   * Possible sorting options to be used in sorting filter in filter bar
   */
  eventsSortingArray: FilterItem[] = [
    {label: 'Name A-Z', value: {key: SortByEnum.NAME, order: SortOrderEnum.ASC}},
    {label: 'Name Z-A', value: {key: SortByEnum.NAME, order: SortOrderEnum.DESC}},
    {label: 'Closest date', value: {key: SortByEnum.DATE, order: SortOrderEnum.ASC}},
    {label: 'Furthest date', value: {key: SortByEnum.DATE, order: SortOrderEnum.DESC}}
  ];


  constructor(
    private fb: FormBuilder,
    private categoryStore: CategoryStore,
    public cdr: ChangeDetectorRef,
    public eventStore: EventsStore) {super()}

  ngOnInit(): void {
    this.createFormGroup();
    this.fetchEvents(true);
    this.setupEventsReaction();
    this.setUpFiltersArray();
  }

  ngOnDestroy(): void {
    this.infLoadStore.resetValues();
    this.eventsReactionDisposer();
  }

  private createFormGroup(): void {
    const sortByDefaultValue = this.specificFilters?.sortBy || this.eventsSortingArray[0];
    const categoryDefaultValue =
      this.specificFilters?.category && this.specificFilters?.category?.length > 0 ?
        this.specificFilters.category.map(c => { return { label: c.name, value: c} } )
        : [];
    const textSearchDefaultValue = this.specificFilters?.textSearch || '';
    const minPriceRangeDefaultValue = this.specificFilters?.minPrice || 0;
    const maxPriceRangeDefaultValue = this.specificFilters?.maxPrice || 1000;
    const organisationIdDefaultValue = this.specificFilters?.organisationId || '';
    const dateDefaultValue = this.specificFilters?.date || '';


    this.eventsFormGroup = this.fb.group({
      [FormControlNames.sortBy]: [{value: sortByDefaultValue, disabled: !!this.specificFilters?.sortBy}],
      [FormControlNames.category]: [{value: categoryDefaultValue, disabled: !!this.specificFilters?.category}],
      [FormControlNames.textSearch]: [{value: textSearchDefaultValue, disabled: !!this.specificFilters?.textSearch}],
      [FormControlNames.priceRange]: this.fb.group({
        [FormControlNames.minPrice]: [minPriceRangeDefaultValue],
        [FormControlNames.maxPrice]: [maxPriceRangeDefaultValue]
      }),
      [FormControlNames.organisationId]: [{value: organisationIdDefaultValue, disabled: !!this.specificFilters?.organisationId}],
      [FormControlNames.date]: [dateDefaultValue]
    });
  }

  setUpFiltersArray() {
    const sortByItem: Filter =  {
      label: 'Sort',
      type: FilterType.SINGLE_SELECTION,
      items: this.eventsSortingArray,
      formControl: this.eventsFormGroup.get(FormControlNames.sortBy) as FormControl,
      canClear: false
    }

    const categoryItem: Filter = {
      label: 'Category',
      type: FilterType.MULTI_SELECTION,
      items: this.categoryStore.categories.data ? this.categoryStore.categories.data!.map(cat => {
        return {label: cat.name, value: cat}
      }) : [],
      formControl: this.eventsFormGroup.get(FormControlNames.category) as FormControl,
      canClear: true
    }

    const priceItem: Filter = {
      label: 'Price',
      type: FilterType.PRICE_RANGE,
      items: [],
      formControl: this.eventsFormGroup.get(FormControlNames.priceRange) as FormControl,
      canClear: true
    }

    const dateItem: Filter = {
      label: 'Date',
      type: FilterType.DATE,
      items: [],
      formControl: this.eventsFormGroup.get(FormControlNames.date) as FormControl,
      canClear: true
    }

    const textSearchItem: Filter = {
      label: 'Search',
      type: FilterType.TEXT_SEARCH,
      items: [],
      formControl: this.eventsFormGroup.get(FormControlNames.textSearch) as FormControl,
      canClear: true
    }

    this.filtersArray = [sortByItem, categoryItem, priceItem, dateItem, textSearchItem];
  }

  private setupEventsReaction(): void {
    this.eventsReactionDisposer = reaction(
      () => this.eventStore.events,
      () => {
        this.cdr.detectChanges();
      }
    );
  }

  public fetchEvents(initial = false): void {
    if (this.eventStore.events.data && this.eventStore.events.data.length  >= this.infLoadStore.currentThreshold && !initial) {
      return;
    }
    const eventListLength = this.eventStore.events.data ? this.eventStore.events.data.length : 0;
    this.eventStore.getEvents(initial ? 0 : eventListLength, EVENTS_INFINITE_SCROLL_BATCH_SIZE, this.prepareEventsFiltersObject(), initial);
  }

  prepareEventsFiltersObject() {
    const filters: EventsFilters = {
      sortBy: this.eventsFormGroup.get(FormControlNames.sortBy)?.value.value.key,
      sortOrder: this.eventsFormGroup.get(FormControlNames.sortBy)?.value.value.order,
      category: this.eventsFormGroup.get(FormControlNames.category)?.value.map((c: FilterItem) => c.value),
      textSearch: this.eventsFormGroup.get(FormControlNames.textSearch)?.value,
      minPrice: this.eventsFormGroup.get(FormControlNames.priceRange)?.get(FormControlNames.minPrice)?.value,
      maxPrice: this.eventsFormGroup.get(FormControlNames.priceRange)?.get(FormControlNames.maxPrice)?.value,
      date: this.eventsFormGroup.get(FormControlNames.date)?.value
    }

    return filters;
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public loadMoreWithButton(): void {
    if (this.infLoadStore.canLoadMore) {
      this.infLoadStore.incrementCurrentThreshold();
      this.fetchEvents();
    }
  }

  public handleInfoCardClick(infoType: InfoCardType) {
    switch (infoType) {
      case InfoCardType.BOTTOM_REACHED: { this.scrollToTop(); break; }
      case InfoCardType.NO_RESULTS_FOUND: {
        const sortByDefaultValue = this.specificFilters?.sortBy || this.eventsSortingArray[0];
        const categoryDefaultValue =
          this.specificFilters?.category && this.specificFilters?.category?.length > 0 ?
            this.specificFilters.category.map(c => { return { label: c.name, value: c} } )
            : [];
        const textSearchDefaultValue = this.specificFilters?.textSearch || '';
        const minPriceRangeDefaultValue = this.specificFilters?.minPrice || 0;
        const maxPriceRangeDefaultValue = this.specificFilters?.maxPrice || 1000;
        const organisationIdDefaultValue = this.specificFilters?.organisationId || '';
        const dateDefaultValue = this.specificFilters?.date || '';

        this.eventsFormGroup.reset({
          [FormControlNames.sortBy]: sortByDefaultValue,
          [FormControlNames.category]: categoryDefaultValue,
          [FormControlNames.textSearch]: textSearchDefaultValue,
          [FormControlNames.priceRange]: this.fb.group({
            [FormControlNames.minPrice]: [minPriceRangeDefaultValue],
            [FormControlNames.maxPrice]: [maxPriceRangeDefaultValue]
          }),
          [FormControlNames.organisationId]: organisationIdDefaultValue,
          [FormControlNames.date]: dateDefaultValue
        });

        this.eventsFormGroup.updateValueAndValidity({ emitEvent: true });
        break;
      }
    }
  }
}
