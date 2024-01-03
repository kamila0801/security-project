import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import {BaseComponent} from '../../../components/global/base/base-component';
import {NavigationUrls} from '../../../constants/Navigation/navigation-urls';
import {FormControlNames} from '../../../constants/formControlNames';
import {CategoryDTO} from "../../../interfaces/dtos/categoryDTO";
import {UserStore} from "../../../stores/api-stores/user.store";

@Component({
  selector: 'app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent extends BaseComponent implements OnInit, AfterViewInit {

  //templates for possible view modes:
  @ViewChild('GENERAL') GENERAL_TEMPLATE!: TemplateRef<any>;
  @ViewChild('CONTACT') CONTACT_TEMPLATE: TemplateRef<any>;
  @ViewChild('BILLING') BILLING_TEMPLATE: TemplateRef<any>;
  @ViewChild('APPEARANCE') APPEARANCE_TEMPLATE: TemplateRef<any>;

  currentView: TemplateRef<any>;

  generalFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  billingFormGroup: FormGroup;
  appearanceFormGroup: FormGroup;

  categoryList: CategoryDTO[] = [];
  fileToUpload: File;

  color: any; //variable that stores inout from color picker
  items: any [] = []

  get currentStep(): number {
    switch(this.currentView) {
      case this.GENERAL_TEMPLATE: return 1;
      case this.CONTACT_TEMPLATE: return 2;
      case this.BILLING_TEMPLATE: return 3;
      case this.APPEARANCE_TEMPLATE: return 4;
      default: return 1;
    }
  }

  constructor(
    private fb: FormBuilder,
    private organisationService: OrganisationService,
    private categoryService: CategoryService,
    private userStore: UserStore,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { super() }

  ngOnInit(): void {
    this.createFormGroups();
    this.fetchCategories();
  }

  ngAfterViewInit(): void {
    this.items = [
      { icon: 'archive', template: this.GENERAL_TEMPLATE },
      { icon: 'map-marker', template: this.CONTACT_TEMPLATE },
      { icon: 'money-stack', template: this.BILLING_TEMPLATE },
      { icon: 'star', template: this.APPEARANCE_TEMPLATE }
    ];
    this.currentView = this.CONTACT_TEMPLATE;
    this.cdr.detectChanges();
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe(categories => this.categoryList = categories);
  }

  createFormGroups() {
    this.generalFormGroup = this.fb.group({
      [FormControlNames.name]: ['', [Validators.required, Validators.minLength(4)]],
      [FormControlNames.category]: ['', Validators.required],
      [FormControlNames.tagline]: ['', []],
      [FormControlNames.description]: ['', [Validators.required]]
    });

    this.contactFormGroup = this.fb.group({
      [FormControlNames.address]: ['', [Validators.required]],
      [FormControlNames.postCode]: [{value: '', disabled: true}, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      [FormControlNames.city]: [{value: '', disabled: true}, [Validators.required]],
      [FormControlNames.phoneNumber]: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.required]],
      [FormControlNames.email]: ['', [Validators.email, Validators.required]]
    })

    this.billingFormGroup = this.fb.group({
      [FormControlNames.regNumber]: ['', [Validators.minLength(4), Validators.maxLength(4)]],
      [FormControlNames.accountNumber]: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    });

    this.appearanceFormGroup = this.fb.group({
      [FormControlNames.colorHex]: [{value: '#5138EC', disabled: true}], //default value is the purple accent
      [FormControlNames.logoUrl]: ['', [Validators.required]]
    })
  }

  createOrganisation() {

    const formData = new FormData();
    formData.append(FormControlNames.name, this.generalFormGroup.get(FormControlNames.name)?.value);
    formData.append(FormControlNames.description, this.generalFormGroup.get(FormControlNames.description)?.value);
    formData.append(FormControlNames.tagline, this.generalFormGroup.get(FormControlNames.tagline)?.value);
    formData.append(FormControlNames.category, this.generalFormGroup.get(FormControlNames.category)?.value);
    formData.append(FormControlNames.address, this.contactFormGroup.get(FormControlNames.address)?.value);
    formData.append(FormControlNames.postCode, this.contactFormGroup.get(FormControlNames.postCode)?.value);
    formData.append(FormControlNames.city, this.contactFormGroup.get(FormControlNames.city)?.value);
    formData.append(FormControlNames.email, this.contactFormGroup.get(FormControlNames.email)?.value);
    formData.append(FormControlNames.phoneNumber, this.contactFormGroup.get(FormControlNames.phoneNumber)?.value !== '' ? this.contactFormGroup.get(FormControlNames.phoneNumber)?.value : 0);
    formData.append(FormControlNames.regNumber, this.billingFormGroup.get(FormControlNames.regNumber)?.value);
    formData.append(FormControlNames.accountNumber, this.billingFormGroup.get(FormControlNames.accountNumber)?.value);
    formData.append(FormControlNames.colorHex, this.appearanceFormGroup.get(FormControlNames.colorHex)?.value);
    formData.append(FormControlNames.file, this.fileToUpload);
    formData.append(FormControlNames.ownerId, '1'); //this.userStore.user?.id.toString());

    this.organisationService.create(formData).subscribe(organisation => {
      this.router.navigateByUrl(NavigationUrls.organisation + organisation.id);
    }, (error) => console.log(error));
  }

  openFileChooser() {
    document.getElementById('chooseLogoTrigger')?.click();
  }

  onFileSelected(event: any) {
    const logoFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(logoFile);
    reader.onload = (e) => {
      this.appearanceFormGroup.get(FormControlNames.logoUrl)?.setValue(reader.result)
    };
    this.fileToUpload = logoFile;
  }

  openColorPicker() {
    document.getElementById('colorPickerTrigger')?.click();
  }

  onColorPicked(event: any) {
    this.appearanceFormGroup.get(FormControlNames.colorHex)?.setValue(event);
  }
}
