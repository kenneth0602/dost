import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


//validator for disallowing charaters for input fields
export function disallowCharacters(): (
  control: AbstractControl
) => ValidationErrors | null {
  const regex =
    /javascript:|data:|vbscript:|on\w+\s*=|style\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(|eval\s*\(|<script|<iframe|<object|<embed/i; // Regex to match any disallowed character

  return (control: AbstractControl): ValidationErrors | null => {
    return regex.test(control.value || '')
      ? { disallowedCharacters: true }
      : null;
  };
}

//validator for accepting only numbers
export function allowOnlyNumeric(): (
  control: AbstractControl
) => ValidationErrors | null {
  const regex = /^\d+$/; // Regex to accept only numeric

  return (control: AbstractControl): ValidationErrors | null => {
    return !regex.test(control.value || '') ? { notNumeric: true } : null;
  };
}

//validator for email
export function emailValidator(): (
  control: AbstractControl
) => ValidationErrors | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to accept only alpha and '-'. max of 100 characters

  return (control: AbstractControl): ValidationErrors | null => {
    return !regex.test(control.value || '')
      ? { invalidEmailAddress: true }
      : null;
  };
}

//validator for cellphone number that will accept only numerical, minimum of 10, and max of 12.
export function cellphoneNumberValidator(): (
  control: AbstractControl
) => ValidationErrors | null {
  const regex = /^0[0-9]{10}$/; // Regex to accept only alpha and '-'. max of 100 characters

  return (control: AbstractControl): ValidationErrors | null => {
    return !regex.test(control.value || '')
      ? { invalidCellphoneNumber: true }
      : null;
  };
}