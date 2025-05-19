
import { Component, OnInit } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
 selector: 'app-profile',
 imports: [
  CommonModule,
  ReactiveFormsModule ,
  RouterLink,
],
 templateUrl: './profile.component.html',
 styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 profileData: any = {};
 updateForm: FormGroup;
 message: string = '';
 isEditing: boolean = false;

 constructor(
   private apiService: ShareDataApiService,
   private fb: FormBuilder 
 ) {
  this.updateForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    age: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    weight: ['', [Validators.required]],
    height: ['', [Validators.required]],
    bod: [null, Validators.required],
    address: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });
}

 ngOnInit(): void {
   this.loadProfile();
 }

 loadProfile(): void {
  this.apiService.getCurrentUserDetails().subscribe({ 
    next: (data) => {
      this.profileData = data;
      let initialUserName = data.userName;
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(initialUserName)) {
        initialUserName = '';
        this.message = 'Your current User Name is invalid. Please enter a new one containing only letters and digits.';
      }
      this.updateForm.patchValue({
        userName: initialUserName,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        bod: data.bod ? new Date(data.bod).toISOString().substring(0, 10) : '',
        height: data.height,
        weight: data.weight,
        address: data.address || '',
        
      });
      console.log('Profile Data:', data);
    },
    error: (err) => {
      console.error('Error loading profile:', err);
      this.message = 'Error loading profile.';
    }
  });
}
 startEdit(): void {
   this.isEditing = true;
 }
 

 cancelEdit(): void {
   this.isEditing = false;
   this.updateForm.reset(this.profileData); 
 }
 getFullAge(bod: string): string {
  const birthDate = new Date(bod);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); 
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} Years, ${months} Months, ${days} Days`;
}

saveProfile(): void {
  if (this.updateForm.valid) {
    const updatedProfileData = {
      userName: this.updateForm.value.userName,
      email: this.updateForm.value.email,
      phoneNumber: this.updateForm.value.phoneNumber,
      bod: this.updateForm.value.bod ? new Date(this.updateForm.value.bod).toISOString() : null,
      height: this.updateForm.value.height,
      weight: this.updateForm.value.weight,
      address: this.updateForm.value.address,
    };
    console.log('Data being sent:', updatedProfileData);

    this.apiService.updateMyProfile(updatedProfileData).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.message = 'Profile updated successfully!';
        this.isEditing = false;
        this.loadProfile(); 
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.message = 'Error updating profile.';
      }
    });
  } else {
    this.message = 'Please fill in all required fields correctly.';
  }
}


  
}