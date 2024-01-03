import {computed, makeAutoObservable} from 'mobx';
import {action} from 'mobx-angular';
import {StatusType} from "../constants/request-status.enums";

export class StoreDataStore<T> {
  private status: StatusType = StatusType.DEFAULT;
  private data: T | null = null;
  private readonly initialValueObj: T | null;

  constructor(private initialValue: T | null = null) {
    makeAutoObservable(this);

    this.data = initialValue;
    this.initialValueObj = initialValue;
  }

  @action resetValue() {
    this.status = StatusType.DEFAULT;
    this.data = this.initialValueObj;
  }

  @action setLoading(shouldReset = true) {
    if (shouldReset) {
      this.data = this.initialValueObj;
    }
    this.status = StatusType.LOADING;
  }

  @action setCompleted(data: T) {
    console.log(data)
    this.status = StatusType.COMPLETED;
    this.data = data;
  }

  @action setFailed() {
    this.status = StatusType.FAILED;
    this.data = this.initialValueObj;
  }

  @computed get getValue() {
    return {data: this.data, status: this.status};
  }

  @action setCompletedButEmpty(data: T) {
    this.status = StatusType.COMPLETED_BUT_EMPTY;
    this.data = data;
  }
}
