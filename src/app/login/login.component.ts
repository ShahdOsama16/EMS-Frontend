import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareDataApiService } from '../share-data-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = new FormGroup({
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(9),
      Validators.pattern(/^[A-Z]/)
    ]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    private _ShareDataApiService: ShareDataApiService,
    private _Router: Router
  ) {}

  userlogindisplay() {
    if (this.loginData.valid) {
      this._ShareDataApiService.login(this.loginData.value).subscribe({
        next: (response) => {
          if (response && response.accessToken && response.role) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user_role', response.role);
            this._ShareDataApiService.isLogin.next(true);
            this._Router.navigate(['/all']);
          } else {
            alert(response.message || 'Login failed: Invalid credentials.');
          }
        },
        error: (error) => {
          let errorMessage = 'An error occurred during login.';
          if (error?.error?.message) {
            errorMessage = 'Login failed: ' + error.error.message;
          } else if (error?.status === 401) {
            errorMessage = 'Login failed: Unauthorized.';
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
    this._ShareDataApiService.isLogin.next(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_role');
    this._Router.navigate(['/login']);
  }
}
