import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isSpinning: boolean = false;

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

    this.isSpinning = !this.isSpinning;
  }
}
