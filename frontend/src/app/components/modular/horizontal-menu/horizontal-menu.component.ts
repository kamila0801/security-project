import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface HorizontalMenuItem {
  header: string;
  isActive: boolean;
}

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html'
})
export class HorizontalMenuComponent {

  @Input() menuItems: HorizontalMenuItem[] = [];
  @Output() itemSelected = new EventEmitter<HorizontalMenuItem>();

  focusItem(item: HorizontalMenuItem) {
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = menuItem === item;
    });
    this.itemSelected.emit(item);
  }

  get calculateActiveItemWidth(): number {
    const index = this.menuItems.indexOf(this.menuItems.find(item => item.isActive)!);

    const menuItem = document.getElementById("item-" + index);
    if (menuItem) {
      return menuItem.clientWidth; // Get the actual width of the menu item
    }
    // Return a default width if the element is not found
    return 80;
  }

  get calculateActiveItemLeft(): number {
    const index = this.menuItems.indexOf(this.menuItems.find(item => item.isActive)!);

    const menuItem = document.getElementById("item-" + index);
    if (menuItem) {
      return menuItem.offsetLeft; // Get the actual width of the menu item
    }

    return 0;
  }

}
