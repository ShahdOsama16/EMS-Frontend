import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

interface WorkoutDetail {
  name: string;
  description: string;
  videoUrl: string | null;
  category: string;
  id: number;
}

@Component({
  selector: 'app-yoga',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './yoga.component.html',
  styleUrls: ['./yoga.component.css'], // ✅ تم تصحيحها من styleUrl إلى styleUrls
})
export class YogaComponent implements OnInit, OnDestroy {
  shoulderworkouts: WorkoutDetail[] = [];
  errorMessage: string = '';
  VideoBaseUrl = 'https://passantmohamed-001-site1.mtempurl.com/videos/';
  private workoutSubscription?: Subscription;

  constructor(
    private apiService: ShareDataApiService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadShoulderWorkouts();
  }

  ngOnDestroy(): void {
    if (this.workoutSubscription) {
      this.workoutSubscription.unsubscribe();
    }
  }

  loadShoulderWorkouts(): void {
    this.workoutSubscription = this.apiService.getWorkouts().subscribe({
      next: (res: any) => {
        if (res && res.items) {
          this.shoulderworkouts = res.items
            .filter((workout: any) => workout.category?.toLowerCase() === 'shoulders' && workout.videoUrl)
            .map((workout: any) => ({
              name: workout.name,
              description: workout.description,
              videoUrl: workout.videoUrl?.startsWith('http')
                ? workout.videoUrl
                : this.VideoBaseUrl + workout.videoUrl,
              category: workout.category,
              id: workout.id,
            } as WorkoutDetail));
          console.log('Shoulder Workouts (with videoUrl):', this.shoulderworkouts);
        } else {
          this.shoulderworkouts = [];
          this.errorMessage = 'No shoulder workouts with videos found.';
          console.log(this.errorMessage);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading shoulder workouts.';
        console.error('Error loading workouts:', err);
      },
    });
  }

  getSafeVideoUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;

    // ✅ دعم روابط YouTube وVimeo إذا موجودة
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId: string | undefined;

      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('shorts/')) {
        videoId = url.split('shorts/')[1]?.split('?')[0];
      }

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }

    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }

    // روابط مباشرة
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
