import {
  AbstractControl,
  ValidatorFn,
  FormGroup,
  ValidationErrors
} from '@angular/forms';

export class CustomConfirmPasswordValidator {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);
      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}

export function createPasswordStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);

      const hasLowerCase = /[a-z]+/.test(value);

      const hasNumeric = /[0-9]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      return !passwordValid ? {passwordStrength:true}: null;
  }
}


export function checkPhoneFormatValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const has10Characters = /^\d{10}$/.test(value);

      const phoneValid = has10Characters;

      return !phoneValid ? {phoneValid:true}: null;
  }
}

export class CheckCountyValidator {
  static MatchValidator(county: string, country: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const countyCtrl = control.get(county);
      const countryCtrl = control.get(country);
      return countyCtrl && countryCtrl && countryCtrl.value === 'KE' && !countyCtrl.value
        ? { countyValid: true }
        : null;
    };
  }
}
