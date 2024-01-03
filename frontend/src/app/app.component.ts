import { Component, OnInit } from '@angular/core';
import { RouterStore } from 'mobx-angular';
import { StringConstants } from './constants/stringConstants';
import { AuthService } from './services/auth.service';
import { ColorModeStore } from './stores/data-stores/color-mode.store';
import jwt_decode from 'jwt-decode';
import {AnimationItem} from "lottie-web";
import {LoaderStore} from "./stores/data-stores/loader.store";
import {BaseComponent} from './components/global/base/base-component';
import {CategoryStore} from "./stores/api-stores/category.store";
import {TokenPayload, UserStore} from "./stores/api-stores/user.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'EventsTeam-frontend';

  // This is the option that uses the package's AnimationOption interface

  constructor(
    public colorModeStore: ColorModeStore,
    public routerStore: RouterStore,
    public authService: AuthService,
    public userStore: UserStore,
    private categoryStore: CategoryStore,
    public loaderStore: LoaderStore) {
    super()
    colorModeStore.setLightMode();
  }

  ngOnInit(): void {
    this.attemptLogin();
    this.categoryStore.getAll();
  }

  /**
   * @describe checks if there is active token in local storage, if no tries to use refresh one. Then tries to login the user
   */
  attemptLogin() {
    const accessToken = localStorage.getItem(StringConstants.ACCESS_TOKEN);
    const expiryTimestamp = localStorage.getItem(StringConstants.TOKEN_EXPIRY_DATE);

    if(accessToken && expiryTimestamp) {
      const tokenPayload: TokenPayload = jwt_decode(accessToken);
      const expiryDate = new Date(parseInt(expiryTimestamp) * 1000);
      const now = new Date();

      console.log('expires in: ', (expiryDate.getTime() - now.getTime()) / 60000 + "min");
      console.log('at: ', expiryDate);

      if(expiryDate.getTime() - now.getTime() > 30000) {
        console.log('fetch user');
        this.userStore.fetchUser(parseInt(tokenPayload.userId));
      } else {
        console.log('token expires soon, refreshing');
        this.authService.refreshToken(parseInt(tokenPayload.userId)).subscribe((newToken) => {
          console.log('new token:', newToken);
          this.authService.saveToken(newToken);
          console.log('fetch user');
          this.userStore.fetchUser(parseInt(tokenPayload.userId));
        })
      }
    } else console.log('no access token');
  }


  // This is the component function that binds to the animationCreated event from the package
  onAnimate(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}

