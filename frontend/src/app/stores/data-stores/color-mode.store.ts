import { Injectable } from "@angular/core";
import {action, computed, observable} from "mobx-angular";
import {makeAutoObservable} from "mobx";

//TODO: hook it up to cookies

@Injectable()
export class ColorModeStore {

    constructor() {
      makeAutoObservable(this)
    }

    @observable private _isDarkMode = false;

    @computed get isDarkMode(): boolean {
      return this._isDarkMode;
    }

    @action setLightMode() {
      this._isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }

    @action setDarkMode() {
      this._isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    @action toggleMode() {
        if(this._isDarkMode) this.setLightMode();
        else this.setDarkMode();
    }

}
