import { Injectable } from '@angular/core';
import { makeAutoObservable } from 'mobx';
import { observable, computed } from 'mobx-angular';
import {StoreDataStore} from "../store-data.store";
import {CategoryDTO} from "../../interfaces/dtos/categoryDTO";
import {CategoryService} from "../../services/category.service";

@Injectable()
export class CategoryStore {
  @observable private _categories = new StoreDataStore<CategoryDTO[]>([{id: 0, name: 'default'}]);

  constructor(
    private service: CategoryService
  ) {
    makeAutoObservable(this);
  }

  @computed get categories() {
    return this._categories.getValue;
  }

  /**
   * @describe retrieves all categories
   */
  getAll() {
    this._categories.setLoading();

    this.service.getAll().subscribe(
      categories => {
        if (categories) {
          this._categories.setCompleted(categories);
        } else {
          this._categories.setFailed();
        }
      },
      error => {
        console.error('Failed to fetch categories:', error);
        this._categories.setFailed();
      }
    );
  }
}
