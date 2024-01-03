import {IconNames} from '../constants/iconNames';
import {ActionIds} from '../constants/action-ids';
import {NavigationUrls} from '../constants/Navigation/navigation-urls';


export interface TopbarActionItem{
  id: ActionIds;
  displayName: string;
  route?: NavigationUrls;
  icon: IconNames
}
