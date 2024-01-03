import {IconNames} from '../../../constants/iconNames';
import {FormControlNames} from '../../../constants/formControlNames';
import {NavigationUrls} from '../../../constants/Navigation/navigation-urls';
import {FieldSizes, InputFieldTypes} from '../../../constants/genericTypes';
import {StatusType} from '../../../constants/request-status.enums';
import {InfoCardType} from "../../modular/events/components/event-card/interfaces/card-info-type.interface";
import {asFormControl} from "../../../utilities/formcontrol.util";
import {compareObjectAsJson} from "../../../utilities/object.utility";
import {FilterType} from "../../modular/filter-bar/interfaces/filter.interface";
import {TextChipSizes} from "../../modular/text-chip/text-chip.component";
import {SortOrderEnum} from "../../../constants/sortingConstants";

export class BaseComponent {

  IconNames = IconNames
  FormControlNames = FormControlNames
  NavigationUrls = NavigationUrls
  FieldSizes = FieldSizes
  InfoCardType = InfoCardType
  InputFieldTypes = InputFieldTypes
  RequestStatusType = StatusType
  SortOrderEnum = SortOrderEnum
  FilterType = FilterType
  TextChipSizes = TextChipSizes

  asFormControl = asFormControl;

  compareObjectAsJson = compareObjectAsJson;

  constructor() {
  }
}
