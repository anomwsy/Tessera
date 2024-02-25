import { AbstractControl, ValidationErrors } from "@angular/forms";

export const validateAge = (minAge: number = 17) => (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; 
    }
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < minAge) {
      return { validateAge: true }; 
    }
  
    return null;  
  };