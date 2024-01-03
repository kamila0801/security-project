import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MobxAngularModule } from 'mobx-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SharedModule } from './modules/shared.module';
import { ColorModeStore } from './stores/data-stores/color-mode.store';
import { AccessTokenInterceptor } from './services/interceptors/access-token.interceptor';
import {LottieModule} from "ngx-lottie";
import {LoaderStore} from "./stores/data-stores/loader.store";
import {AnimationStatusStore} from "./stores/data-stores/animation-status.store";
import {CategoryStore} from "./stores/api-stores/category.store";
import {UserStore} from "./stores/api-stores/user.store";
import {EventsStore} from "./stores/api-stores/events.store";
import {
    LoginLoadingAnimationComponent
} from "./shared/loading-temp-dir/login-loading-animation/login-loading-animation.component";

export function playerFactory(): any {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        MobxAngularModule,
        HttpClientModule,
        BrowserAnimationsModule,
        LottieModule.forRoot({player: playerFactory}),
        LoginLoadingAnimationComponent
    ],
    exports: [
        HttpClientModule,
    ],
  bootstrap: [AppComponent],
  providers: [
    UserStore,
    CategoryStore,
    EventsStore,
    ColorModeStore,
    LoaderStore,
    AnimationStatusStore,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
