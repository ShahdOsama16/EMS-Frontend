
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ShareDataApiService } from '../share-data-api.service'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submissionSuccess: boolean = false;
  submissionError: string = '';

  constructor(
    private fb: FormBuilder,
    private shareDataApiService: ShareDataApiService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['',Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submitContactForm(formData: any): void {
    console.log('Form Data:', formData); 
    this.shareDataApiService.createContactUs(formData).subscribe({
      
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.submissionSuccess = false;
      this.submissionError = '';

      this.shareDataApiService.createContactUs(formData).subscribe({
        next: (response) => {
          console.log('Contact message sent successfully:', response);
          this.submissionSuccess = true;
          this.contactForm.reset(); 
        },
      });
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}