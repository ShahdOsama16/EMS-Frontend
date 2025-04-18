// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service'; // Adjust the path
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // For updating profile
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
 selector: 'app-profile',
 imports: [
  CommonModule,
  ReactiveFormsModule ,RouterLink
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
   private fb: FormBuilder // For form building
 ) {
   this.updateForm = this.fb.group({
     name: ['', Validators.required],
     age: ['',[Validators.required]],
     email: ['', [Validators.required, Validators.email]],
     weight: ['',[Validators.required]],
     height: ['',[Validators.required]]
   });
 }

 ngOnInit(): void {
   this.loadProfile();
 }

 loadProfile(): void {
   this.apiService.getMyProfile().subscribe({
     next: (data) => {
       this.profileData = data;
       // Populate the updateForm with the initial data
       this.updateForm.patchValue(this.profileData);
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
   this.updateForm.reset(this.profileData); // Reset form to original data
 }

 saveProfile(): void {
   if (this.updateForm.valid) {
     this.apiService.updateMyProfile(this.updateForm.value).subscribe({
       next: (response) => {
         console.log('Profile updated:', response);
         this.message = 'Profile updated successfully!';
         this.isEditing = false;
         this.loadProfile(); // Reload to show updated data
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