import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareDataApiService } from '../share-data-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern(/^[A-Z]/)]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) { }

  userlogindisplay() {
    if (this.loginData.valid) {
      console.log('Login form value:', this.loginData.value);
      this._ShareDataApiService.login(this.loginData.value).subscribe({
        next: (response) => {
          console.log('Login API Response:', response);

          if (response && response.accessToken && response.role) {
            console.log('Login successful! Token and role are present and valid.');
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user_role', response.role);
            this._Router.navigate(['/all']);
            this._ShareDataApiService.isLogin.next(true);
          } else {
            console.warn('Login successful response did not contain expected data (missing accessToken or role).', response);
            alert('Login was successful, but the application may not function correctly due to missing access token or user role. Check the server response.');
            this._Router.navigate(['/all']);
            this._ShareDataApiService.isLogin.next(true);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          let errorMessage = 'An error occurred during login. Please try again later.';
          if (error?.error?.message) {
            errorMessage = 'Login failed: ' + error.error.message;
          } else if (error?.status === 401) {
            errorMessage = 'Login failed: Invalid username or password.';
          }
          alert(errorMessage);
        }
      });
    } else {
      alert('Please ensure the form is filled out correctly.');
    }
  }

  logout() {
    this._ShareDataApiService.clearAuthData();
  }
}
