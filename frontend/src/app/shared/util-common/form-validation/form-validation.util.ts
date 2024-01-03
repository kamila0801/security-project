// Validator Keys
// --------------
export type ValidatorErrorKeys =
  'required' |
  'invalidMinLength' |
  'specialCharRequired' |
  'lowercaseRequired' |
  'invalidEmail' |
  'uppercaseRequired';

// Validator Error Details
// -----------------------
export interface ValidationErrorDetails {
  message: string;
}

// Error Creation Utility
// ----------------------

/**
 * Utility function to create a structured validation error.
 * @param key The specific key of the validation error.
 * @param details The detailed message and any additional information.
 * @returns A structured validation error object.
 */
export const createValidationError = <T extends ValidatorErrorKeys>(key: T, details: ValidationErrorDetails): Record<T, ValidationErrorDetails> => {
  return { [key]: details } as Record<T, ValidationErrorDetails>;
};
