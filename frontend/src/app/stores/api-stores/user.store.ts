import {Injectable} from '@angular/core';
import {action, makeAutoObservable} from 'mobx';
import {computed, observable} from 'mobx-angular';
import {UserModel} from "../../interfaces/userModel";
import {UserService} from "../../services/user.service";
import jwt_decode from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {StoreDataStore} from "../store-data.store";
import {Router} from "@angular/router";
import {LoginDTO} from "../../interfaces/dtos/auth/loginDTO";
import {RegisterDTO} from "../../interfaces/dtos/auth/registerDTO";
import {StringConstants} from "../../constants/stringConstants";
import {EncryptionUtility} from "../../utilities/encryption.utility";
import {GOOGLE_OAUTH_CLIENT_ID} from "../../constants/keys";
import {CredentialResponse} from "google-one-tap";
import {LoaderStore} from "../data-stores/loader.store";
import {firstValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

export interface TokenPayload {
  aud: string;
  email: string;
  exp: number;
  userId: string;
  iss: string;
}

declare const FB: any;

@Injectable()
export class UserStore {

  @observable private _isLoggedIn: boolean = false;
  @observable private _user = new StoreDataStore<UserModel>({id: 0, email: 'default', firstName: 'default', lastName: 'default', city: 'default', postCode: 0, phoneNumber: 0, address: 'default'});
  @observable public _jwt = new StoreDataStore<string>('');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private loaderStore: LoaderStore
  ) {
    makeAutoObservable(this);
  }

  @action set setIsLoggedIn(isLoggedIn: boolean) {
    this._isLoggedIn = isLoggedIn;
  }
  @computed get user() {
    return this._user.getValue;
  }
  @computed get isLoggedIn() {
    return this._isLoggedIn;
  }
  @computed get getToken(): any {
    return localStorage.getItem(StringConstants.ACCESS_TOKEN);
  }

  public async loginWithFacebook() {
    try {
      const authResponse = await new Promise<{ accessToken: string }>((resolve, reject) => {
        FB.login((response: { authResponse: { accessToken: any; }; }) => {
          if (response.authResponse) {
            resolve({ accessToken: response.authResponse.accessToken });
          } else {
            reject('Facebook login failed');
          }
        }, { scope: 'email' });
      });

      await this.loaderStore.performActionWithStatusUpdate(
        async () => {
          const token = await firstValueFrom(this.authService.loginWithFacebook(authResponse.accessToken));
          this.processLoginResponse(token);
        },
        async () => await this.router.navigate(['/'])
      );
    } catch (error) {
      this._jwt.setFailed();
      console.warn('Ups something went wrong! ' + error);
    }
  }

  private async loginWithGoogle(response: CredentialResponse) {
    try {
      await this.loaderStore.performActionWithStatusUpdate(
        async () => {
          const token = await firstValueFrom(this.authService.signInWithGoogle(response.credential));
          this.processLoginResponse(token);
        },
        async () => await this.router.navigate(['/'])
      );
    } catch (error) {
      console.warn('Ups something went wrong! ' + error);
    }
  }

  public async loginWithUsernameAndPassword(loginDTO: LoginDTO): Promise<void> {
    this._jwt.setLoading();
    try {
      const token: string = await firstValueFrom(this.authService.login(loginDTO));

      if (token) {
        this.processLoginResponse(token);
      }
    } catch (error) {
      this._jwt.setFailed();
      throw error;
    }
  }

  private processLoginResponse(token: string) {
    const tokenPayload: TokenPayload = jwt_decode(token);
    this.authService.saveToken(token);
    this.fetchUser(parseInt(tokenPayload.userId));
    this._jwt.setCompleted(token)
  }

  public async register(registerDTO: RegisterDTO) {
    try {
      await firstValueFrom(this.authService.register(registerDTO));

      const clientSecret = EncryptionUtility.createIV();
      const loginDTO = {
        email: registerDTO.email,
        clientSecret: clientSecret,
        password: EncryptionUtility.encrypt(registerDTO.password, clientSecret, environment.AUTH_KEY)
      }

      await this.loginWithUsernameAndPassword(loginDTO);
    } catch (error) {
      console.error('Register failed:', error);
    }
  }

  public async fetchUser(userId: number) {
    this._user.setLoading();
    try {
      // Convert the Observable to a Promise using firstValueFrom and await it
      const user: UserModel = await firstValueFrom(this.userService.fetchUser(userId));

      // Check if the user object is truthy after the fetch call
      if (user) {
        this.setIsLoggedIn = true;
        this._user.setCompleted(user);
        console.log('user fetched', user);
      } else {
        // If the user object is falsy, treat it as a failed operation
        console.error('No user returned from fetch operation');
        this._user.setFailed();
      }
    } catch (error) {
      console.error('Fetch user failed:', error);
      this._user.setFailed();
    }
  }

  public logout() {
    this.authService.logout().subscribe(() => {
      this.setIsLoggedIn = false;
      this.authService.removeToken();
      this._user.resetValue();
      this._jwt.resetValue();
    });
  }

  public async updateUser(userDto: any) {
    this._user.setLoading();
    try {
      const user: UserModel = await firstValueFrom(this.userService.updateUser(userDto));

      if (user) {
        this._user.setCompleted(user);
        console.log('user fetched', user);
      } else {
        // If the user object is falsy, treat it as a failed operation
        console.error('No user returned from update operation');
        this._user.setFailed();
      }
    } catch (error) {
      console.error('Fetch user failed:', error);
      this._user.setFailed();
    }
  }

  public startGoogleLogin() {
    this.loadGoogleOneTap().then(() => {
      this.initialGoogleLogic();
    });
  }

  private loadGoogleOneTap(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://accounts.google.com/gsi/client';
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.body.appendChild(scriptElement);
    });
  }

  private initialGoogleLogic(){
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        callback: this.loginWithGoogle.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        // this hides the one tap promt from the view
        prompt_parent_id: 'testRemoveOneTap',
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("google-social-login-btn"),
        { size: "large", shape: 'rectangular', text: 'continue_with', type: 'standard', logo_alignment: 'left', width: 300, theme: 'outline'}
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }
}
