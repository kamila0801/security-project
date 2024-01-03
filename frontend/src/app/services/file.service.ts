import { Injectable } from '@angular/core';
import { ServerURLs } from '../constants/serverURLs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getOrganisationLogo(fileName: string) {
    return ServerURLs.FILE_GET_ORGANISATION_LOGO + fileName;
  }

  getEventLogo(fileName: string) {
    return ServerURLs.FILE_GET_EVENT_LOGO + fileName;
  }
}
