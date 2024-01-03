import {AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketModel } from 'src/app/interfaces/ticketModel';
import { EventService } from 'src/app/services/event.service';
import {BaseComponent} from '../../../components/global/base/base-component';
import {FormControlNames} from '../../../constants/formControlNames';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent extends BaseComponent implements AfterViewInit{

  //templates for 3 possible view modes:
  @ViewChild('GENERAL') GENERAL_TEMPLATE!: TemplateRef<any>;
  @ViewChild('WHERE') WHERE_TEMPLATE: TemplateRef<any>;
  @ViewChild('PRICING') PRICING_TEMPLATE: TemplateRef<any>;
  @ViewChild('APPEARANCE') APPEARANCE_TEMPLATE: TemplateRef<any>;

  currentView: TemplateRef<any>;

  get currentStep(): number {
    switch(this.currentView) {
      case this.GENERAL_TEMPLATE: return 1;
      case this.WHERE_TEMPLATE: return 2;
      case this.PRICING_TEMPLATE: return 3;
      case this.APPEARANCE_TEMPLATE: return 4;
      default: return 1;
    }
  }

  get isPricingFormGroupValid(): boolean {
    return !this.tickets.find((fb: FormGroup) => !fb.valid);
  }

  generalFormGroup: FormGroup;
  detailsFormGroup: FormGroup;
  appearanceFormGroup: FormGroup;
  tickets: FormGroup[];

  fileToUpload: File;
  color: any; //variable that stores inout from color picker
  items: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { super() }

  ngOnInit(): void {
    this.createFormGroups();
  }

  ngAfterViewInit(): void {
    this.items = [
      { icon: 'archive', template: this.GENERAL_TEMPLATE },
      { icon: 'map-marker', template: this.WHERE_TEMPLATE },
      { icon: 'money-stack', template: this.PRICING_TEMPLATE },
      { icon: 'star', template: this.APPEARANCE_TEMPLATE }
    ];
    this.currentView = this.WHERE_TEMPLATE;
    this.cdr.detectChanges();
  }

  createFormGroups() {
    this.generalFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      shortDescription: ['', []],
      fullDescription: ['', [Validators.required]]
    });

    this.detailsFormGroup = this.fb.group({
      [FormControlNames.address]: ['', [Validators.required]],
      [FormControlNames.postCode]: [{value: '', disabled: true}, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      [FormControlNames.city]: [{value: '', disabled: true}, [Validators.required]],
      [FormControlNames.date]: ['', Validators.required],
      [FormControlNames.time]: ['', Validators.required]
    })

    this.tickets = [this.fb.group({
      [FormControlNames.type]: ['', Validators.required],
      [FormControlNames.price]: ['', Validators.required]
    })];

    this.appearanceFormGroup = this.fb.group({
      [FormControlNames.colorHex]: [{value: '#5138EC', disabled: true}], //default value is the purple accent
      [FormControlNames.logoUrl]: ['', [Validators.required]]
    })
  }

  addTicketOption() {
    this.tickets.push(
      this.fb.group({
        [FormControlNames.type]: ['', Validators.required],
        [FormControlNames.price]: ['', Validators.required]
      })
    );
  }

  removeTicketOption(index: number) {
    this.tickets.splice(index, 1);
  }

  createEvent() {
    const tickets = Object.assign([], this.tickets.map((fg: FormGroup) => fg.value))

    const dateValue = this.detailsFormGroup.get(FormControlNames.date)?.value;
    const timeValue = this.detailsFormGroup.get(FormControlNames.time)?.value;
    const dateTimeString = dateValue + 'T' + timeValue + ':00';
    const dateTime = new Date(dateTimeString);

    const formData = new FormData();
    formData.append(FormControlNames.name, this.generalFormGroup.get(FormControlNames.name)?.value);
    formData.append(FormControlNames.fullDescription, this.generalFormGroup.get(FormControlNames.fullDescription)?.value);
    formData.append(FormControlNames.shortDescription, this.generalFormGroup.get(FormControlNames.shortDescription)?.value);
    formData.append(FormControlNames.address, this.detailsFormGroup.get(FormControlNames.address)?.value);
    formData.append(FormControlNames.postCode, this.detailsFormGroup.get(FormControlNames.postCode)?.value);
    formData.append(FormControlNames.city, this.detailsFormGroup.get(FormControlNames.city)?.value);
    formData.append(FormControlNames.date, dateTime.toISOString()),
    formData.append(FormControlNames.colorHex, this.appearanceFormGroup.get(FormControlNames.colorHex)?.value);
    formData.append(FormControlNames.file, this.fileToUpload);
    formData.append(FormControlNames.organisationId, '1'); //FIXME: get actual org id
    tickets.forEach((ticket: TicketModel, index: number) => {
      formData.append(`tickets[${index}].price`, ticket.price.toString());
      formData.append(`tickets[${index}].type`, ticket.type)
    })

    this.eventService.create(formData).subscribe(event => {
      console.log(event);
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
