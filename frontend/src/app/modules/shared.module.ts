import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/components/global/sidebar/sidebar.component';
import { IconBtnComponent } from 'src/app/components/generic/icon-btn/icon-btn.component';
import { InputFieldComponent } from 'src/app/components/generic/input-field/input-field.component';
import { ToggleComponent } from 'src/app/components/generic/toggle/toggle.component';
import { TopbarComponent } from 'src/app/components/global/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/components/generic/button/button.component';
import { SelectFieldComponent } from '../components/generic/select-field/select-field.component';
import { TitleComponent } from '../components/generic/title/title.component';
import { FilterBarComponent } from '../components/modular/filter-bar/filter-bar.component';
import { OrganisationCardComponent } from '../components/modular/organisation-card/organisation-card.component';
import { TextFieldComponent } from '../components/generic/text-field/text-field.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { ColorPickerModule } from 'ngx-color-picker';
import { GoogleMapsModule } from '@angular/google-maps';
import { CreateProgressBarComponent } from '../components/modular/create-progress-bar/create-progress-bar.component';
import { GoogleMapsComponent } from '../components/modular/google-maps/google-maps.component';
import {SidebarItemComponent} from "../components/global/sidebar/components/sidebar-item/sidebar-item.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import {TopbarItemComponent} from "../components/global/topbar/components/topbar-item/topbar-item.component";
import {
  NotificationIndicatorComponent
} from "../components/modular/notification-indicator/notification-indicator.component";
import {BadgeComponent} from "../components/modular/badge/badge.component";
import {EventsComponent} from "../components/modular/events/events.component";
import {EventCardComponent} from "../components/modular/events/components/event-card/event-card.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {ScrollLoaderComponent} from "../components/modular/scroll-loader/scroll-loader.component";
import {LottieModule} from "ngx-lottie";
import {NoResultsComponent} from "../components/modular/no-results/no-results.component";
import {SliderFieldComponent} from "../components/generic/slider-field/slider-field.component";
import {MatSliderModule} from "@angular/material/slider";
import {MobileSidebarComponent} from "../components/global/mobile-sidebar/mobile-sidebar.component";
import {
  MobileSidebarItemComponent
} from "../components/global/mobile-sidebar/components/mobile-sidebar-item/mobile-sidebar-item.component";
import {OverlayComponent} from "../components/modular/overlay/overlay.component";
import {TextChipComponent} from "../components/modular/text-chip/text-chip.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {
  FiltersCardMobileComponent
} from "../components/modular/filter-bar/components/filters-card-mobile/filters-card-mobile.component";
import {FiltersCardComponent} from "../components/modular/filter-bar/components/filters-card/filters-card.component";
import {
  FiltersCardButtonsComponent
} from "../components/modular/filter-bar/components/filters-card-buttons/filters-card-buttons.component";
import {DateSelectComponent} from "../components/modular/filter-bar/components/date-select/date-select.component";
import {TextInputComponent} from "../shared/ui-common/input/ui-common/text-input/text-input.component";
import {HorizontalMenuComponent} from "../components/modular/horizontal-menu/horizontal-menu.component";

@NgModule({
  declarations: [
    HorizontalMenuComponent,
    DateSelectComponent,
    FiltersCardButtonsComponent,
    TextChipComponent,
    OverlayComponent,
    FiltersCardComponent,
    FiltersCardMobileComponent,
    MobileSidebarComponent,
    SelectFieldComponent,
    SidebarComponent,
    ToggleComponent,
    IconBtnComponent,
    TopbarComponent,
    InputFieldComponent,
    ButtonComponent,
    EventCardComponent,
    TitleComponent,
    FilterBarComponent,
    OrganisationCardComponent,
    TextFieldComponent,
    CreateProgressBarComponent,
    GoogleMapsComponent,
    SidebarItemComponent,
    TopbarItemComponent,
    NotificationIndicatorComponent,
    BadgeComponent,
    EventsComponent,
    ScrollLoaderComponent,
    NoResultsComponent,
    SliderFieldComponent,
    MobileSidebarComponent,
    MobileSidebarItemComponent
  ],
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      ColorPickerModule,
      GoogleMapsModule,
      MatTooltipModule,
      InfiniteScrollModule,
      NgxMatSelectSearchModule,
      LottieModule,
      MatSliderModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      TextInputComponent
    ],
  exports: [
    HorizontalMenuComponent,
    DateSelectComponent,
    FiltersCardButtonsComponent,
    OverlayComponent,
    FiltersCardComponent,
    FiltersCardMobileComponent,
    MobileSidebarComponent,
    SelectFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent,
    ToggleComponent,
    IconBtnComponent,
    TopbarComponent,
    InputFieldComponent,
    ButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    EventCardComponent,
    TitleComponent,
    FilterBarComponent,
    OrganisationCardComponent,
    TextFieldComponent,
    ColorPickerModule,
    GoogleMapsModule,
    CreateProgressBarComponent,
    GoogleMapsComponent,
    SidebarItemComponent,
    TopbarItemComponent,
    NotificationIndicatorComponent,
    BadgeComponent,
    EventsComponent,
    ScrollLoaderComponent,
    NoResultsComponent,
    SliderFieldComponent,
    MobileSidebarComponent,
    MobileSidebarItemComponent,
    TextChipComponent,
    TextInputComponent
  ]
})
export class SharedModule { }
