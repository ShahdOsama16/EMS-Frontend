import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Workout {
  name: string;
  description: string;
  videoUrl: string | null;
  category: string;
  id: number;
}

@Component({
  selector: 'app-stretching',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './stretching.component.html',
  styleUrls: ['./stretching.component.css'], // ✅ التصحيح هنا: styleUrls بدلاً من styleUrl
})
export class StretchingComponent implements OnInit, OnDestroy {
  chestWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private subscription: Subscription | undefined;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchChestWorkouts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchChestWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe(
      (response) => {
        this.chestWorkouts = response.items.filter(workout => workout.category?.toLowerCase() === 'chest');
        console.log('Fetched Chest Workouts:', this.chestWorkouts);
      },
      (error) => {
        console.error('Error fetching chest workouts:', error);
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

    // Handle YouTube Shorts
    if (url.includes('youtube.com/shorts/')) {
      const shortId = url.split('shorts/')[1]?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${shortId}`;
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      console.log('Output (YouTube Shorts):', embedUrl);

    // Handle YouTube standard
    } else if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('be/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log('Output (YouTube Embed):', embedUrl);
      }

    // Handle Vimeo
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      console.log('Output (Vimeo Embed):', embedUrl);

    // All others
    } else {
      safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log('Output (Other):', url);
    }

    return safeUrl;
  }
}
