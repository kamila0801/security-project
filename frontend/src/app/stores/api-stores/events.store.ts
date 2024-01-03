import {Injectable} from '@angular/core';
import {action, makeAutoObservable} from 'mobx';
import {observable, computed} from 'mobx-angular';
import {EventModel} from "../../interfaces/eventModel";
import {StoreDataStore} from "../store-data.store";
import {EventService} from "../../services/event.service";
import {EventsFilters} from "../../interfaces/filters/eventsFilters";

@Injectable()
export class EventsStore {
  @observable private _events = new StoreDataStore<EventModel[]>(null);
  @observable private _totalCount = 0;

  constructor(
    private service: EventService
  ) {
    makeAutoObservable(this);
  }

  @action private set setTotalCount(value: number) {
    this._totalCount = value;
  }

  @computed get totalCount() {
    return this._totalCount;
  }

  @computed get events() {
    return this._events.getValue;
  }

  getEvents(skip: number, take: number, filter: EventsFilters, initial: boolean) {
    this._events.setLoading(false);

    this.service.getAll(skip, take, filter).subscribe(
      events => {
        if (events) {
          if (initial) {
            this._events.setCompleted(events.data);
          } else {
            this._events.setCompleted([...(this.events.data ?? []), ...events.data]);
          }
          this.setTotalCount = events.total;

        } else {
          this._events.setFailed();
        }
      },
      error => {
        console.error('Failed to fetch events:', error);
        this._events.setFailed();
      }
    );
  }
}
