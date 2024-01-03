import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit, signal, Signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoaderStore} from "../../../stores/data-stores/loader.store";
import {Router} from "@angular/router";
import {AUTH_KEY} from '../../../constants/keys';
import {EncryptionUtility} from "../../../utilities/encryption.utility";
import {BaseComponent} from '../../../components/global/base/base-component';
import {UserStore} from "../../../stores/api-stores/user.store";
import validators from "../../../shared/util-common/form-validation/form-validators";
import {applyPasswordComplexityValidators} from "../../../shared/util-common/form-validation/password-validator";
import {sleep} from "../../../shared/util-common/timing.util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('LOGIN') LOGIN_TEMPLATE!: TemplateRef<any>;
  @ViewChild('REGISTER') REGISTER_TEMPLATE!: TemplateRef<any>;
  @ViewChild('FORGOT_PASSWORD') FORGOT_PASS_TEMPLATE!: TemplateRef<any>;

  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  restorePassFormGroup: FormGroup;

  viewMode = signal<TemplateRef<any>>(this.LOGIN_TEMPLATE);

  constructor(
    private formBuilder: FormBuilder,
    public userStore: UserStore,
    public loaderStore: LoaderStore,
    private router: Router) {
    super();
  }

  ngOnDestroy(): void {
    if (['FAILED', 'READY'].includes(this.loaderStore.loadingStatus())) {
      this.loaderStore.loadingStatus.set('DEFAULT');
    }
  }

  ngOnInit(): void {
    this.createFormGroups();
    this.loaderStore.loadingStatus.set('READY');
  }


  ngAfterViewInit(): void {
    this.viewMode.set(this.LOGIN_TEMPLATE);
    this.userStore.startGoogleLogin();
  }

  private createFormGroups() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', []],
      password: ['', []]
    });

    this.registerFormGroup = this.formBuilder.group({
      firstName: ['', [validators.validateRequired]],
      lastName: ['', [validators.validateRequired]],
      email: ['', [validators.validateRequired, validators.validateEmailFormat()]],
      password: ['', [validators.validateRequired, ...applyPasswordComplexityValidators()]]
    });

    this.restorePassFormGroup = this.formBuilder.group({
      email: ['', [validators.validateRequired, validators.validateEmailFormat()]],
    });
  }

  public async loginWithUsernameAndPassword() {
    const clientSecret = EncryptionUtility.createIV();
    const loginDTO = {
      email: this.loginFormGroup.get('email')!.value,
      clientSecret: clientSecret,
      password: EncryptionUtility.encrypt(this.loginFormGroup.get('password')!.value, clientSecret, AUTH_KEY)
    }
    await this.loaderStore.performActionWithStatusUpdate(
      () => this.userStore.loginWithUsernameAndPassword(loginDTO),
      () => this.router.navigate(['/'])
    );
  }

  public async register() {
    await this.loaderStore.performActionWithStatusUpdate(
      () => this.userStore.register({
        firstName: this.registerFormGroup.get('firstName')!.value,
        lastName: this.registerFormGroup.get('lastName')!.value,
        email: this.registerFormGroup.get('email')!.value,
        password: this.registerFormGroup.get('password')!.value
      }),
      () => this.router.navigate(['/'])
    );
  }

  sendRestorePassword() {
    //TODO: implement
  }

  async changeView(desiredView: any) {
    if (this.loaderStore.isProcessingQueue()) {
      return;
    }

    this.loaderStore.loadingStatus.set('LOADING');
    await sleep(1000);
    this.viewMode.set(desiredView);
    if (desiredView === this.LOGIN_TEMPLATE) {
      this.userStore.startGoogleLogin();
    }
    this.loaderStore.loadingStatus.set('FAILED');
  }
}
