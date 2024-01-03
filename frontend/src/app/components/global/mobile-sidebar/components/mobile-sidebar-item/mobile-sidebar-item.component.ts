import {Component, Input} from '@angular/core';
import {SidebarItemInterface} from "../../../sidebar/interfaces/sidebar-item.interface";

@Component({
  selector: 'app-mobile-sidebar-item',
  templateUrl: './mobile-sidebar-item.component.html'
})
export class MobileSidebarItemComponent {

  @Input() item: SidebarItemInterface;
  /**
   * setting this value to true will add a background in accent color to the item
   */
  @Input() isAccent: boolean = false;

}
