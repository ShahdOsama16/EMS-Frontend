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
  selector: 'app-aerobics',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './aerobics.component.html',
  styleUrls: ['./aerobics.component.css'], // ✅ تصحيح styleUrl → styleUrls
})
export class AerobicsComponent implements OnInit, OnDestroy {
  legsWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private subscription: Subscription | undefined;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLegsWorkouts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchLegsWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe(
      (response) => {
        this.legsWorkouts = response.items.filter(workout => workout.category?.toLowerCase() === 'legs');
        console.log('Legs Workouts:', this.legsWorkouts);
      },
      (error) => {
        console.error('Error fetching legs workouts:', error);
      }
    );
  }

  getSafeVideoUrl(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) return null;

    // ✅ دعم YouTube Shorts, watch, youtu.be, Vimeo
    let videoId: string | undefined;

    if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }

    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }

      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }

    if (url.includes('vimeo.com')) {
      videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${videoId}`);
      }
    }

    // روابط مباشرة أو غير معروفة
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
