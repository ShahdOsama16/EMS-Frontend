import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service'; 
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-message',
  imports: [RouterLink, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, OnDestroy {
  contactMessages: any[] = [];
  messageSubscription: Subscription | undefined;
  errorMessage: string = '';

  constructor(private router: Router, private messageService: ShareDataApiService) {}

  ngOnInit(): void {
    this.loadContactMessages();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  loadContactMessages(): void {
    this.messageSubscription = this.messageService.getContactMessages().subscribe({
      next: (data) => { 
        this.contactMessages = data.items; 
        console.log('Contact Messages:', this.contactMessages);
      },
      error: (error) => {
        this.errorMessage = 'Error loading contact messages.';
        console.error(this.errorMessage, error);
      }
    });
  }
}