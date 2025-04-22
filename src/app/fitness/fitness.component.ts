import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Workout {
  name: string;
  description: string;
  videoUrl: string;
  category: string;
  id: number;
}

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.css'], // ✅ تصحيح: styleUrls بدلًا من styleUrl
})
export class FitnessComponent implements OnInit, OnDestroy {
  biTriWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private subscription: Subscription | undefined;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBiTriWorkouts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchBiTriWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe(
      (response) => {
        this.biTriWorkouts = response.items.filter(
          (workout) => workout.category === 'Biceps' || workout.category === 'Triceps'
        );
        console.log('Bi & Tri Workouts:', this.biTriWorkouts);
      },
      (error) => {
        console.error('Error fetching Bi & Tri workouts:', error);
      }
    );
  }

  getSafeVideoUrl(url: string | null | undefined): SafeResourceUrl | null {
    console.log('Input URL:', url);
    if (!url) {
      return null;
    }

    let safeUrl: SafeResourceUrl | null = null;

    if (url.includes('youtube.com/shorts/')) {
      const shortId = url.split('shorts/')[1]?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${shortId}`;
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      console.log('Output (YouTube Shorts Embed):', embedUrl);

    } else if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      let videoId: string | undefined;
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('be/')[1]?.split('?')[0];
      }
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log('Output (Standard YouTube Embed):', embedUrl);
      } else {
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log('Fallback (YouTube - No ID):', url);
      }

    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log('Output (Vimeo Embed):', embedUrl);
      } else {
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log('Fallback (Vimeo - No ID):', url);
      }

    } else {
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log('Output (Other URL):', url);
    }

    return safeUrl;
  }
}
