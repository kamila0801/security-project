import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {createValidationError} from "./form-validation.util";

/**
 * Validator to check if a field is required and non-empty.
 * @returns A ValidatorFn that provides a required field validation error if necessary.
 */
const validateRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return createValidationError('required', {
      message: `This input is required.`
    });
  }
  return null;
};

/**
 * Validates that the input string meets a minimum length requirement.
 * @param {number} minLength - The minimum number of characters required.
 * @returns {ValidatorFn} A function that provides a minimum length validation error if necessary.
 */
const validateMinLength = (minLength: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < minLength) {
      return createValidationError('invalidMinLength', {
        message: `Must have at least ${minLength} characters.`
      });
    }
    return null;
  };
};

/**
 * Validates that the input contains a specified minimum count of special characters.
 * @param {number} minCount - The minimum number of special characters required.
 * @returns {ValidatorFn} A function that provides a special character count validation error if necessary.
 */
const validateIncludesSpecialChar = (minCount: number): ValidatorFn => {
  const pattern = /[!@#$%^&*(),.?":{}|<>]/g; // Global flag to find all matches
  return (control: AbstractControl): ValidationErrors | null => {
    const matches = control.value ? control.value.match(pattern) : null;
    if (!matches || matches.length < minCount) { // Changed to !matches to catch null
      return createValidationError('specialCharRequired', {
        message: `Must include at least ${minCount} special character${minCount > 1 ? 's' : ''}.`
      });
    }
    return null;
  };
};

/**
 * Validates that the input contains a specified minimum count of lowercase letters.
 * @param {number} minCount - The minimum number of lowercase letters required.
 * @returns {ValidatorFn} A function that provides a lowercase character count validation error if necessary.
 */
const validateIncludesLowercase = (minCount: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const matches = value.match(/[a-z]/g) || [];
    if (matches.length < minCount) {
      return createValidationError('lowercaseRequired', {
        message: `Must include at least ${minCount} lowercase letter${minCount > 1 ? 's' : ''}.`
      });
    }
    return null;
  };
};

/**
 * Validates that the input contains a specified minimum count of uppercase letters.
 * @param {number} minCount - The minimum number of uppercase letters required.
 * @returns {ValidatorFn} A function that provides an uppercase character count validation error if necessary.
 */
const validateIncludesUppercase = (minCount: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const matches = value.match(/[A-Z]/g) || [];
    if (matches.length < minCount) {
      return createValidationError('uppercaseRequired', {
        message: `Must include at least ${minCount} uppercase letter${minCount > 1 ? 's' : ''}`
      });
    }
    return null;
  };
};

/**
 * Validates that the input string is in a valid email format.
 * The function uses a regular expression to test the email format, which includes
 * support for international characters within the email address.
 *
 * @returns {ValidatorFn} A function that provides an email format validation error
 * if the input does not match the expected email pattern.
 */
const validateEmailFormat = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-Z0-9._%+'-æøåäöÆØÅÄÖ]+@[a-zA-Z0-9.-æøåäöÆØÅÄÖ]+\.[a-zA-Z]{2,4}$/;
    if (control.value && !pattern.test(control.value)) {
      return createValidationError('invalidEmail', {
        message: 'Invalid email format.'
      });
    }
    return null;
  };
};

const validators = {
  validateMinLength,
  validateRequired,
  validateIncludesLowercase,
  validateIncludesUppercase,
  validateIncludesSpecialChar,
  validateEmailFormat
};

export default validators;
