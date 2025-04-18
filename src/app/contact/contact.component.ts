// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//     selector: 'app-contact',
//     imports: [],
//     templateUrl: './contact.component.html',
//     styleUrl: './contact.component.css'
// })
// export class ContactComponent {
   


// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDataApiService } from '../share-data-api.service'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports:[ReactiveFormsModule],
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
    // Optional: Any initialization logic here
  }

  submitContactForm(formData: any): void {
    console.log('Form Data:', formData); 
    this.shareDataApiService.createContactUs(formData).subscribe({
      // ...
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
          this.contactForm.reset(); // Clear the form on success
        },
        // error: (error) => {
        //   console.error('Error sending contact message:', error);
        //   this.submissionError = 'There was an error sending your message. Please try again later.';
        // }
      });
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}