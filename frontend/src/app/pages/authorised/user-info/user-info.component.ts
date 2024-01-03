import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FieldSizes} from 'src/app/constants/genericTypes';
import {BaseComponent} from '../../../components/global/base/base-component';
import {UserStore} from "../../../stores/api-stores/user.store";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  FieldSizes = FieldSizes;

  constructor(
    public userStore: UserStore,
    private fb: FormBuilder
  ) {super()}

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup() {
    this.formGroup = this.fb.group({
      id: [{ value: this.userStore.user.data?.id, disabled: true}, [Validators.required]],
      firstName: [this.userStore.user.data?.firstName, [Validators.required]],
      lastName: [this.userStore.user.data?.lastName, [Validators.required]],
      email: [this.userStore.user.data?.email, [Validators.required]],
      address: [this.userStore.user.data?.address, []],
      postCode: [this.userStore.user.data?.postCode, []],
      city: [this.userStore.user.data?.city, []],
      phoneNumber: [this.userStore.user.data?.phoneNumber, []]
    })
  }


  updateUser() {
    const userDto = {} as any;
    const controls = this.formGroup.controls;
    Object.keys(controls).forEach(controlName => {
      userDto[controlName] = controls[controlName].value;
    });
    this.userStore.updateUser(userDto);
  }
}
