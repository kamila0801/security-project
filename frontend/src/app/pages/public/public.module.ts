import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { RouterModule } from '@angular/router';
import { EventsComponent } from '../../components/modular/events/events.component';
import { OrganisationsComponent } from './organisations/organisations.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { OrganisationInfoComponent } from './organisation-info/organisation-info.component';
import {LottieComponent} from "ngx-lottie";
import { EventsPageComponent } from './events-page/events-page.component';
import {ButtonComponent} from "../../shared/ui-common/button/button.component";
import {SocialLoginButtonComponent} from "../../shared/ui-common/social-login-button/social-login-button.component";
import {
  InvalidSubmitMessageComponent
} from "../../shared/ui-common/invalid-submit-message/invalid-submit-message.component";



@NgModule({
    declarations: [
        FrontpageComponent,
        OrganisationsComponent,
        AboutUsComponent,
        LoginComponent,
        OrganisationInfoComponent,
        EventsPageComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: FrontpageComponent,
        pathMatch: 'full'
      },
      {
        path: 'events',
        component: EventsPageComponent
      },
      {
        path: 'clubs',
        component: OrganisationsComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'organisation/:id',
        component: OrganisationInfoComponent
      }
    ]),
    LottieComponent,
    ButtonComponent,
    SocialLoginButtonComponent,
    InvalidSubmitMessageComponent
  ]
})
export class PublicModule { }
