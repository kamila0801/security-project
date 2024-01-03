import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonStyleTypes, ButtonTypes} from "./buttonStyleTypes";

@Component({
  selector: 'app-button-a',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html'
})
export class ButtonComponent {

  /**
   * Specifies the text to be displayed on the button.
   *
   * If not provided, the button will not display any text.
   */
  @Input() btnText: string = '';

  /**
   * @Input btnType - Specifies the functional behavior of the button.
   *
   * Determines the primary action the button performs when clicked:
   * - 'reset': Will revert the form values to their initial state. Typically used on form elements to provide users the option to clear their input.
   * - 'submit': Initiates the form submission process. This is commonly used for sending form data to a server or triggering form validation.
   * - 'button': A general-purpose button without any form-specific behavior. It simply acts as a clickable UI element, and its behavior can be customized as needed.
   */
  @Input() btnType: ButtonTypes;

  /**
   * @Input btnStyle - Specifies the visual appearance of the button.
   *
   * This determines the button's visual feedback to users, providing context about its purpose or the nature of the action it will trigger:
   * - 'normal': A standard button style suitable for primary actions without any special significance.
   * - 'attention': Indicates an action that may have significant consequences, or which requires user confirmation. Often used for delete actions or to highlight primary actions.
   * - 'warning': A visual alert to users about potential issues or to proceed with caution.
   * - 'info': Represents a neutral or informational action, perhaps leading to more details or additional context.
   * - 'proceed': Indicates a positive or successful action, often used for confirmations or to proceed to the next step in a process.
   */
  @Input() btnStyle: ButtonStyleTypes;

  /**
   * Determines whether the button is disabled or not.
   *
   * If true, the button will be disabled and unclickable.
   * If false, the button will be enabled and clickable.
   * Default value is false.
   */
  @Input() disabled: boolean = false;

  /**
   * Specifies an icon to be displayed on the button.
   *
   * If provided, the icon will be displayed alongside the button text.
   * If not provided, only the button text will be displayed.
   */
  @Input() icon: string;

  /**
   * Event emitted when the button is clicked.
   *
   * Parent components can listen to this event to handle button clicks.
   */
  @Output() onClick = new EventEmitter();
}
