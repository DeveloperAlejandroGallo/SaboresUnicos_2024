
import { AbstractControl, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';

export class CustomValidators extends Validators {


  static passwordIguales(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const primerControl = control.get(controlName);
      const segundoControl = control.get(matchingControlName);

      return primerControl && segundoControl && primerControl.value !== segundoControl.value ? { 'passwordIguales': true } : null;
    };
  }



}
