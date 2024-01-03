import {FormControl} from '@angular/forms';
import validators from './form-validators';

const testValidateMinLength = () => {
  const minLength = 5;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateMinLength(minLength));
  });

  it('should not have errors if length is equal to or greater than min length', () => {
    control.setValue('12345');
    expect(control.errors).toBeNull();
  });

  it('should have invalidMinLength error if length is less than min length', () => {
    control.setValue('123');
    expect(control.errors).toEqual({ invalidMinLength: jasmine.anything() });
  });
};

const testValidateEmailFormat = () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateEmailFormat());
  });

  it('should not have errors for a valid email', () => {
    control.setValue('test@example.com');
    expect(control.errors).toBeNull();
  });

  it('should have invalidEmail error for an invalid email', () => {
    control.setValue('test@example');
    expect(control.errors).toEqual({ invalidEmail: jasmine.anything() });
  });
};

const testValidateRequired = () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateRequired);
  });

  it('should have an error if value is empty', () => {
    control.setValue('');
    expect(control.errors).toEqual({ required: jasmine.anything() });
  });

  it('should not have errors if value is provided', () => {
    control.setValue('notEmpty');
    expect(control.errors).toBeNull();
  });
};

const testValidateIncludesSpecialChar = () => {
  const minCount = 2;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateIncludesSpecialChar(minCount));
  });

  it('should have an error if value does not include enough special characters', () => {
    control.setValue('abc@');
    expect(control.errors).toEqual({ specialCharRequired: jasmine.anything() });
  });

  it('should not have errors if value includes enough special characters', () => {
    control.setValue('abc!@');
    expect(control.errors).toBeNull();
  });
};

const testValidateIncludesLowercase = () => {
  const minCount = 2;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateIncludesLowercase(minCount));
  });

  it('should have an error if value does not include enough lowercase letters', () => {
    control.setValue('ABCDEF');
    expect(control.errors).toEqual({ lowercaseRequired: jasmine.anything() });
  });

  it('should not have errors if value includes enough lowercase letters', () => {
    control.setValue('Abcdef');
    expect(control.errors).toBeNull();
  });
};

const testValidateIncludesUppercase = () => {
  const minCount = 2;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', validators.validateIncludesUppercase(minCount));
  });

  it('should have an error if value does not include enough uppercase letters', () => {
    control.setValue('abcDe');
    expect(control.errors).toEqual({ uppercaseRequired: jasmine.anything() });
  });

  it('should not have errors if value includes enough uppercase letters', () => {
    control.setValue('AbCDef');
    expect(control.errors).toBeNull();
  });
};

const validatorTestCases = {
  validateMinLength: testValidateMinLength,
  validateEmailFormat: testValidateEmailFormat,
  validateRequired: testValidateRequired,
  validateIncludesSpecialChar: testValidateIncludesSpecialChar,
  validateIncludesLowercase: testValidateIncludesLowercase,
  validateIncludesUppercase: testValidateIncludesUppercase
};

describe('Custom Validators', () => {
  // Dynamically create test suites for each validator
  Object.keys(validators).forEach((validatorKey) => {
    // @ts-ignore //TODO REMOVE THIS??
    const testFunction: any = validatorTestCases[validatorKey];
    if (!testFunction) {
      throw new Error(`No test case function defined for validator: ${validatorKey}`);
    }

    describe(validatorKey, () => {
      testFunction();
    });
  });
});
