import {Component, EventEmitter, Output} from '@angular/core';
import {BaseComponent} from "../../../../global/base/base-component";

@Component({
  selector: 'app-filters-card-buttons',
  templateUrl: './filters-card-buttons.component.html'
})
export class FiltersCardButtonsComponent extends BaseComponent {

  @Output() closeFiltersEmitter = new EventEmitter<any>();
  @Output() applyFiltersEmitter = new EventEmitter<any>();

}
