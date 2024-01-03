import { Component, Input, OnInit } from '@angular/core';
import { OrganisationModel } from 'src/app/interfaces/organisationModel';
import { FileService } from 'src/app/services/file.service';
import {BaseComponent} from '../../global/base/base-component';

@Component({
  selector: 'app-organisation-card',
  templateUrl: './organisation-card.component.html'
})
export class OrganisationCardComponent extends BaseComponent implements OnInit {

  @Input() organisation: OrganisationModel;

  constructor(public fileService: FileService) { super() }

  ngOnInit(): void {
  }

}
