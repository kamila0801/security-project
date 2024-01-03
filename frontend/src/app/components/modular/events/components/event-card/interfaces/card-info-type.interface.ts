import {IconNames} from "../../../../../../constants/iconNames";

export enum InfoCardType {
  BOTTOM_REACHED = 'BOTTOM_REACHED',
  NO_RESULTS_FOUND = 'NO_RESULTS_FOUND'
}

export interface InfoCardDetails {
  mainIcon: IconNames,
  title: string,
  description: string,
  btnIcon: IconNames,
  btnText: string
}
