import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseComponent} from "../base/base-component";
import {SidebarItemInterface} from "../sidebar/interfaces/sidebar-item.interface";
import {IconNames} from "../../../constants/iconNames";
import {NavigationUrls} from "../../../constants/Navigation/navigation-urls";
import {ColorModeStore} from "../../../stores/data-stores/color-mode.store";

@Component({
  selector: 'app-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileSidebarComponent extends BaseComponent {

  constructor(public colorModeStore: ColorModeStore) {
    super();
  }

  private _isOpen = false;
  sidebarItems: SidebarItemInterface[] = [
    {iconName: IconNames.estate, link: NavigationUrls.home, text: 'Home'},
    {iconName: IconNames.calendarAlt, link: NavigationUrls.events, text: 'Events'},
    {iconName: IconNames.usersAlt, link: NavigationUrls.clubs, text: 'Clubs'},
    {iconName: IconNames.infoCircle, link: NavigationUrls.aboutUs, text: 'About us'}]

  get isOpen() {
    return this._isOpen;
  }

  openSidebar() {
    this._isOpen = true;
  }

  closeSidebar() {
    this._isOpen = false;
  }
}
