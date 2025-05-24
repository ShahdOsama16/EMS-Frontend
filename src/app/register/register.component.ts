import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareDataApiService } from '../share-data-api.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    UserDataForm = new FormGroup({
        userName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern(/^[A-Z]/)]),
        phone: new FormControl(),
        email: new FormControl(),
        password: new FormControl(null, [Validators.required]), 
        weight: new FormControl(),
        height: new FormControl(),
        bod: new FormControl(),
        address: new FormControl()
    });
    userdatadisplay() {
        console.log('Register form value:', this.UserDataForm.value);
        this._ShareDataApiService.register(this.UserDataForm.value).subscribe(
            (res) => {
                console.log('Registration API Response:', res);
                this._Router.navigate(['/login']); 
                alert('Registration successful! Please log in.');
            },
            (error) => {
                console.error('Registration failed:', error);
                alert('Registration failed. Please try again.');
            }
        );
    }

    constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) { }
}
