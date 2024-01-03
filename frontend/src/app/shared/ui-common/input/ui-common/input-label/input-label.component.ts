import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-label.component.html'
})
export class InputLabelComponent {

  /**
   * REQUIRED - Label to be associated with the input field.
   *
   * This will be displayed above the input, providing context or instruction to the user.
   */
  @Input() label: string;

  @Input() isFieldOptional: boolean;
  @Input() maxLength: any;
  @Input() currentLength: any;
  @Input() showOptional = true;
}
