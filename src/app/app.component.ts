import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, interval, tap, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isSpinning: boolean = false;
  isAutoMode: boolean = false;
  autoSpinIntervalSubscription: Subscription = new Subscription();

  images: string[] = [
    './assets/images/cherries.png',
    './assets/images/seven.png',
    './assets/images/watermelon.png',
    './assets/images/bar.png',
    './assets/images/cherries.png',
    './assets/images/seven.png',
    './assets/images/watermelon.png',
    './assets/images/bar.png',
  ];

  reelImages = [[], [], []];
  spinningReelImages = [[], [], []];

  ngOnInit(): void {
    this.initReelSymbol();
  }

  initReelSymbol(): void {
    this.reelImages.forEach((_, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });
  }

  shuffleSymbol = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  spin() {
    this.isSpinning = true;

    this.spinningReelImages.forEach((_, index) => {
      this.spinningReelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });

    this.reelImages.forEach((_, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.reelImages[index]))
      );
    });

    timer(2000).subscribe((_) => {
      this.isSpinning = false;
    });
  }

  onAutoClick() {
    this.isAutoMode = !this.isAutoMode;

    if (this.isAutoMode) {
      this.spin();
      this.autoSpinIntervalSubscription = interval(4000).subscribe(() => {
        this.spin();
      });
    } else {
      this.isSpinning = false;
      this.autoSpinIntervalSubscription.unsubscribe();
    }
  }
}
