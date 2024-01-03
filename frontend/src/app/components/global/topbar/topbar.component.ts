import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IconNames} from '../../../constants/iconNames';
import {BaseComponent} from '../base/base-component';
import {FormControlNames} from '../../../constants/formControlNames';
import {TopBarItemInterface} from './interfaces/top-bar-item.interface';
import {TopbarItemIds} from './constants/topbar-item-ids';
import {UserStore} from "../../../stores/api-stores/user.store";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;

  topBarItems: TopBarItemInterface[] = [
    {id: TopbarItemIds.jobs, iconName: IconNames.briefcase, toolTip: 'Jobs'},
    {id: TopbarItemIds.notification, iconName: IconNames.bell, toolTip: 'Notification'},
    {id: TopbarItemIds.likedItems, iconName: IconNames.heart, toolTip: 'Liked'}
  ]

  constructor(
    public fb: FormBuilder,
    public userStore: UserStore) {
    super()
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      [FormControlNames.searchbar]: ['']
    });
  }
}
