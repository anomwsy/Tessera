import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  detailForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private cookieService: CookieService
  ) {
    this.detailForm = this.createForm();
  }

  ngOnInit(): void {
    this.detailForm = this.createForm();
  }
  onSubmit() {
    this.markFormGroupTouched(this.detailForm);
    if (this.detailForm.valid) {
      const value = this.detailForm.getRawValue();
      if (value) {
        this.isLoading = true;
        this.service.Login(value.username, value.password).subscribe({
          next: (result) => {
            console.log(result)
            this.isLoading = false;
            this.cookieService.set('authToken', result.token, 365, '/');
            this.errorMessage = null;
            this.router.navigate(['/']);
          },
          error: (error) => {
            if (typeof error.error === 'object') {
              this.errorMessage = 'Server Error';
            } else {
              this.errorMessage = error.error;
            }
            this.isLoading = false;
          },
        });
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
  }


  createForm() {
    return this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      termAndCondition: ['', Validators.compose([Validators.requiredTrue])],
    });
  }

  onInputChange() {
    // Sembunyikan pesan kesalahan saat nilai input berubah
    if (this.errorMessage && this.errorMessage !== '') {
      this.errorMessage = null;
    }
  }

}
