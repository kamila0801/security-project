import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TopBarItemInterface} from "../../interfaces/top-bar-item.interface";
import {TopbarItemIds} from '../../constants/topbar-item-ids';

@Component({
  selector: 'app-topbar-item',
  templateUrl: './topbar-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarItemComponent {
  @Input() item: TopBarItemInterface;
  @Output() iconClick = new EventEmitter<TopBarItemInterface>()

  // TODO TEMPORARY VALUE
  get getHasNotifications() {
    return this.item.id === TopbarItemIds.notification;
  }
}
