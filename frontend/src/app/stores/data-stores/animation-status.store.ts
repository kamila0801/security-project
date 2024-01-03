import {Injectable} from "@angular/core";
import {action, makeAutoObservable} from "mobx";
import {computed, observable} from "mobx-angular";
import {StatusType} from "../../constants/request-status.enums";

@Injectable()
export class AnimationStatusStore {

  @observable private sidebarItemMoving: StatusType = StatusType.COMPLETED;
  @observable private sidebarItem: StatusType = StatusType.COMPLETED;

  constructor(
  ) {
    makeAutoObservable(this);
  }

  @computed get getSidebarItemMoving(): StatusType {
    return this.sidebarItemMoving;
  }

  @action set setSidebarItemMoving(value: StatusType) {
    this.sidebarItemMoving = value;
  }

  @computed get getSidebarItem(): StatusType {
    return this.sidebarItem;
  }

  @action set setSidebarItem(value: StatusType) {
    this.sidebarItem = value;
  }
}
