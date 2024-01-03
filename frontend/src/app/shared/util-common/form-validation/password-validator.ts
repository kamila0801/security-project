// Password Complexity Configuration and Utilities
// -----------------------------------------------

// Constants defining the password complexity rules
import {ValidatorFn} from "@angular/forms";
import validators from "./form-validators";
import {ValidatorErrorKeys} from "./form-validation.util";

const MIN_LENGTH = 8;
const MIN_SPECIAL_CHARS = 1;
const MIN_LOWERCASE_CHARS = 1;
const MIN_UPPERCASE_CHARS = 1;

interface PasswordComplexityConfigItem {
  validator: ValidatorFn;
  partialMessage: string;
}

/**
 * Configuration object for password complexity, associating validation keys with
 * their corresponding validator functions and messages.
 */
const passwordComplexityConfig: Partial<Record<ValidatorErrorKeys, PasswordComplexityConfigItem>> = {
  invalidMinLength: {
    validator: validators.validateMinLength(MIN_LENGTH),
    partialMessage: `${MIN_LENGTH} characters minimum`,
  },
  specialCharRequired: {
    validator: validators.validateIncludesSpecialChar(MIN_SPECIAL_CHARS),
    partialMessage: `${MIN_SPECIAL_CHARS} special character${MIN_SPECIAL_CHARS > 1 ? 's' : ''}`,
  },
  lowercaseRequired: {
    validator: validators.validateIncludesLowercase(MIN_LOWERCASE_CHARS),
    partialMessage: `${MIN_LOWERCASE_CHARS} lowercase letter${MIN_LOWERCASE_CHARS > 1 ? 's' : ''}`,
  },
  uppercaseRequired: {
    validator: validators.validateIncludesUppercase(MIN_UPPERCASE_CHARS),
    partialMessage: `${MIN_UPPERCASE_CHARS} uppercase letter${MIN_UPPERCASE_CHARS > 1 ? 's' : ''}`,
  },
};

/**
 * Applies all configured password complexity validators.
 * @returns An array of ValidatorFn.
 */
export const applyPasswordComplexityValidators = (): ValidatorFn[] => {
  return Object.values(passwordComplexityConfig).map(item => item.validator);
};

/**
 * Retrieves keys for password complexity validators along with their associated messages.
 * @returns An array of objects containing validator keys and their partial messages.
 */
export const getPasswordComplexityValidatorKeys = (): { key: ValidatorErrorKeys, partialMessage: string }[] => {
  return Object.entries(passwordComplexityConfig).map(([key, value]) => ({
    key: key as ValidatorErrorKeys,
    partialMessage: value.partialMessage
  }));
};
