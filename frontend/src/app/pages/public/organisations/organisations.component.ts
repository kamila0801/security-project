import { Component, OnInit } from '@angular/core';
import { OrganisationModel } from 'src/app/interfaces/organisationModel';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
})
export class OrganisationsComponent implements OnInit {

  organisationList: OrganisationModel[] | undefined;
  //TODO: enums ??
  sortingList = ["Name", "City"];

  constructor(
    private organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
  }

  fetchOrganisations(filter: any) {
    const sortBy = filter.sortBy.toUpperCase();
    const categoryId = filter.category?.id == -1 ? undefined : filter.category?.id;
    // TODO: change skip and take
    const skip = 0;
    const take = 10;
    this.organisationService.getAll(skip, take, sortBy, categoryId).subscribe(organisationsPaged => this.organisationList = organisationsPaged.data);
  }

}
