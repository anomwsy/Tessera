import { AbstractControl, ValidationErrors } from '@angular/forms';

export const DueDateValidation =
  (range: number = 1) =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    let dueDate = new Date(value);
    let today = new Date();
    today.setDate(today.getDate() + range - 1);
    if (dueDate < today || dueDate == today) {
      return {
        DueDateValidation : `Due date must be within ${range} days from today.`,
      };
    }

    return null;
  };
