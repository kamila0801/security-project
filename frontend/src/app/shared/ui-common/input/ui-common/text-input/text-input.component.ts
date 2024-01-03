import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextInputTypes} from "./text-input.types";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IconComponent} from "../../../icon/icon.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {InputLabelComponent} from "../input-label/input-label.component";
import {getPasswordComplexityValidatorKeys} from "../../../../util-common/form-validation/password-validator";
import validators from "../../../../util-common/form-validation/form-validators";
import {InputErrorIconComponent} from "../input-error-icon/input-error-icon.component";

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, MatTooltipModule, InputLabelComponent, InputErrorIconComponent],
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent {

  /**
   * Specifies the type of the initial input for the component.
   *
   * The type will determine how the input is rendered and behaves.
   */
  @Input() initialInputType: TextInputTypes;

  /**
   * Specifies the value for the "autocomplete" attribute of the input field.
   *
   * This value dictates how the browser should support input suggestions or autocompletion
   * for the input field. For instance, values can be "off", "on", "username", "email", etc.
   * Refer to the HTML autocomplete attribute specification for potential values. Read more here:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute
   */
  @Input() autocompleteValue: string;

  /**
   * Specifies an icon to be placed to the left of the input.
   *
   * If provided, the icon will be rendered to the left of the input.
   * If not provided there will be no icon rendered to the left of the input.
   */
  @Input() leftIcon: string;

  /**
   * Determines whether the background of the input should be inverted or not.
   *
   * If true, the input will have an inverted background style (For light-mode this is white).
   * If false, the input will have a non-inverted background style (For light-mode this is grey).
   */
  @Input() isBackgroundInverted: boolean;

  /**
   * REQUIRED - Placeholder text to show in the input field when it is empty.
   *
   * Provides a hint or prompt for the user, guiding them on the expected input.
   */
  @Input() placeholder: string;

  /**
   * REQUIRED - Label to be associated with the input field.
   *
   * This will be displayed above the input, providing context or instruction to the user.
   */
  @Input() label: string;

  /**
   * Determines whether the label associated with the input field should be displayed.
   *
   * If true, the label will be displayed above the input field.
   * If false, the label will be hidden.
   * Default value is true.
   */
  @Input() shouldShowLabel = true;

  /**
   * REQUIRED - The form control instance associated with this input.
   *
   * Enables the component to be driven by reactive form mechanisms.
   * Allows for validation, value changes, and other form functionalities.
   */
  @Input() inputFormControl: FormControl;

  /**
   * Defines the maximum number of characters allowed in the input field.
   *
   * The value of this property sets an upper limit on the number of characters
   * that the user can enter into the text input. If the value is undefined,
   * there is no maximum length enforced on the input.
   *
   * @type {number | undefined}
   * @default undefined - By default, the maximum length property is not set,
   * which means the input accepts an unlimited number of characters.
   * To enforce a specific limit, set this property to a positive integer.
   */
  @Input() maxLength: number | null = null;

  /**
   * Determines rather the input field should show the errors in the message and icon
   *
   * If true, the input field will show in errors in the form control visually
   * If false, it will not show any errors in the form control visually
   */
  @Input() showErrors = true;

  @Input() showOptional = true;

  /**
   * Determines rather the input field has been interacted with or not.
   *
   * If true, the input field been interacted with since it trigger to become true on blur.
   * If false, the input field has not yet been interacted with.
   */
  private hasInputFieldHadInteraction = false;

  /**
   * Determines rather the input field has been focused with or not.
   *
   * If true, the input field focused as it becomes true on focus-within.
   * If false, the input field has not yet been focused.
   */
  public hasFieldBeenFocused = false;

  /**
   * Determines rather the password field should have visible text or just dots.
   *
   * If true, the password field should show the password as plain text.
   * If false, the password field should show the password as dots.
   */
  public shouldShowPassword = false;

  /**
   * An array of validator keys and their associated partial messages for password complexity.
   * This property is populated by calling `getPasswordComplexityValidatorKeys`, which
   * constructs the array based on the currently configured password complexity validation rules.
   */
  public passwordComplexityValidatorKeys = getPasswordComplexityValidatorKeys();

  /**
   * Checks if the form control field associated with this input is optional.
   *
   * Returns true if the field does not have the "required" validation.
   * Returns false otherwise.
   */
  public get isFieldOptional(): boolean {
    return !this.inputFormControl.hasValidator(validators.validateRequired);
  }

  /**
   * Checks if the initial input type of the component is of type 'password'.
   *
   * Returns true if the initial input type is 'password'.
   * Returns false otherwise.
   */
  public get isFieldPassword(): boolean {
    return this.initialInputType === 'password';
  }

  /**
   * Determines the type of input to display for password fields based on user's choice to reveal or hide the password.
   *
   * Returns 'text' if the user has chosen to display the password as plain text.
   * Returns 'password' if the user has chosen to mask the password.
   */
  public get passwordInputType(): TextInputTypes {
    return this.shouldShowPassword ? 'text' : 'password';
  }

  /**
   * Toggles the visibility of the password between plain text and dots.
   *
   * Also ensures that the input field remains focused after toggling.
   */
  public toggleShowPassword(): void {
    this.shouldShowPassword = !this.shouldShowPassword;

    // Ensure refocus of the input field after toggling
    document.getElementById(this.label + '-text-input' )?.focus();
  }

  /**
   * Determines if an error should be displayed for the input field.
   *
   * Returns true if the form control has errors, and it has either been touched or has a value,
   * and is not disabled, and the input field has been interacted with.
   * Returns false otherwise.
   */
  public get shouldShowError(): boolean {
    return this.inputFormControl.errors && (this.inputFormControl.touched || this.inputFormControl.value)
      && !this.inputFormControl.disabled && this.hasInputFieldHadInteraction;
  }

  /**
   * Handles the blur event for the input field.
   *
   * Sets the `hasInputFieldHadInteraction` flag to true to indicate that the input field has been interacted with.
   */
  public handleBlur() {
    this.hasInputFieldHadInteraction = true;
  }

  /**
   * Handles the click event for the left icon associated with the input field.
   *
   * When the left icon is clicked, the associated input field receives focus.
   */
  public onLeftIconClick() {
    document.getElementById(this.label + '-text-input')?.focus();
  }

  getFirstErrorMessage(control: FormControl): string {
    if (control.errors) {
      const firstKey = Object.keys(control.errors)[0];
      return control.errors[firstKey]?.message || null;
    }
    return '';
  }
}
