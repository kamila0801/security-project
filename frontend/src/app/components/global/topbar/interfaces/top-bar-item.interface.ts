import {TopbarItemIds} from "../constants/topbar-item-ids";
import {IconNames} from "../../../../constants/iconNames";

export interface TopBarItemInterface {
  id: TopbarItemIds;
  iconName: IconNames;
  toolTip: string;
}
