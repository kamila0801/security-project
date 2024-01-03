import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrganisationComponent } from './create-organisation/create-organisation.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { UserInfoComponent } from './user-info/user-info.component';



@NgModule({
  declarations: [
    CreateOrganisationComponent,
    CreateEventComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
          path: 'create-organisation',
          component: CreateOrganisationComponent,
          pathMatch: 'full'
      },
      {
        path: 'create-event',
        component: CreateEventComponent,
        pathMatch: 'full'
      },
      {
        path: 'user-info',
        component: UserInfoComponent,
        pathMatch: 'full'
      }
    ]),
  ]
})
export class AuthorisedModule { }
