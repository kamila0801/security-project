import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganisationModel } from 'src/app/interfaces/organisationModel';
import { OrganisationService } from 'src/app/services/organisation.service';
import { Location } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';
import {RoleService} from "../../../services/role.service";
import {RoleModel} from "../../../interfaces/roleModel";
import {UserStore} from "../../../stores/api-stores/user.store";

@Component({
  selector: 'app-organisation-info',
  templateUrl: './organisation-info.component.html'
})
export class OrganisationInfoComponent implements OnInit, AfterViewInit {

  organisation: OrganisationModel;
  roles: any[];
  userRole: RoleModel | null;

  @ViewChild('INFO') INFO_TEMPLATE!: TemplateRef<any>;
  @ViewChild('EVENTS') EVENTS_TEMPLATE!: TemplateRef<any>;
  @ViewChild('MEMBERSHIP') MEMBERSHIP_TEMPLATE!: TemplateRef<any>;
  @ViewChild('CONTACT') CONTACT_TEMPLATE!: TemplateRef<any>;
  viewMode: TemplateRef<any>;

  constructor(
    private organisationService: OrganisationService,
    private route: ActivatedRoute,
    private location: Location,
    private eventService: EventService,
    public fileService: FileService,
    public userStore: UserStore,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')) {
      const organisationId: number = Number.parseInt(this.route.snapshot.paramMap.get('id')!);
      const passedOrg = (this.location.getState() as any)?.organisation;
      if(passedOrg) {
        //if we have organisation already, we only need to fetch the events
        this.organisation = passedOrg;
        this.eventService.getByOrganisation(this.organisation.id, 'DATE')
          .subscribe(events => this.organisation.events = events);
      }
      else this.organisationService.getById(organisationId)
        .subscribe(org => this.organisation = org);

      if(this.userStore.isLoggedIn) {
        this.roleService.getRoleByUserInOrganisation(this.userStore.user.data!.id, organisationId)
          .subscribe(role => {
            this.userRole = role;
            if(role.hierarchyLevel === 0) {
              this.roleService.getAllRolesInOrganisation(organisationId).subscribe(roles => {
                this.roles = roles;
              })
            }
          })
      }
    }
  }

  ngAfterViewInit() {
    this.viewMode = this.INFO_TEMPLATE;
    this.cdr.detectChanges();
  }

}
