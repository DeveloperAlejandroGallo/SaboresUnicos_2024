
import { AbstractControl, ValidatorFn, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

export function confirmarClaveValidator() : ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const clave = formGroup.get('password');
    const repiteClave = formGroup.get('passwordRep');
    const respuestaError = {noCoincide: 'La clave no coincide'}

    if (clave?.value !== repiteClave?.value){
      formGroup.get('passwordRep')?.setErrors(respuestaError);

      return respuestaError;
    } else {
      formGroup.get('passwordRep')?.setErrors(null);
      return null;
    }
  };
}


