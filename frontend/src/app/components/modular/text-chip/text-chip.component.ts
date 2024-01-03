import {Component, Input} from '@angular/core';

export enum TextChipSizes {
  SMALL,
  MEDIUM
}
@Component({
  selector: 'app-text-chip',
  templateUrl: './text-chip.component.html'
})
export class TextChipComponent {

  @Input() text: string;
  @Input() isActive: boolean = false;
  @Input() size: TextChipSizes = TextChipSizes.MEDIUM;

  protected readonly TextChipSizes = TextChipSizes;
}
