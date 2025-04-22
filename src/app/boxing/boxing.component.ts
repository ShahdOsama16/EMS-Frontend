import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Workout {
  name: string;
  description: string;
  videoUrl: string | null;
  category: string;
  id: number;
}

@Component({
  selector: 'app-boxing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './boxing.component.html',
  styleUrls: ['./boxing.component.css'] // ← Fix هنا بدل styleUrl
})
export class BoxingComponent implements OnInit, OnDestroy {
  AbsWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private subscription: Subscription | undefined;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchabsWorkouts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchabsWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe(
      (response) => {
        this.AbsWorkouts = response.items.filter(workout => workout.category === 'Abs');
      },
      (error) => {
        console.error('Error fetching Abs workouts:', error);
      }
    );
  }

  getSafeVideoUrl(url: string | null | undefined): SafeResourceUrl | null {
    console.log('Input URL:', url);
    if (!url) {
      console.log('Output: null (empty URL)');
      return null;
    }

    let safeUrl: SafeResourceUrl | null = null;
    const parts = url.split('/');
    const potentialVideoId = parts[parts.length - 1];

    if (url.includes('youtube.com/shorts/')) {
      // Embed YouTube Shorts correctly
      const shortId = url.split('shorts/')[1]?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${shortId}`;
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      console.log('Output (YouTube Shorts Embed):', embedUrl);

    } else if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('be/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log('Output (YouTube Embed):', embedUrl);
      } else {
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log('Output (Fallback YouTube URL):', url);
      }

    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log('Output (Vimeo Embed):', embedUrl);
      } else {
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log('Output (Vimeo - No ID):', url);
      }

    } else {
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log('Output (Other URL):', url);
    }

    return safeUrl;
  }
}
