import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'slot-game';

  isSpinning: boolean = false;

  images: string[] = [
    '../assets/images/cherries.png',
    '../assets/images/seven.png',
    '../assets/images/watermelon.png',
    '../assets/images/bar.png',
    '../assets/images/cherries.png',
    '../assets/images/seven.png',
    '../assets/images/watermelon.png',
    '../assets/images/bar.png',
  ];

  reelImages = [[], [], []];
  spiningReelImages = [[], [], []];

  ngOnInit(): void {
    this.initReelSymbol();
  }

  initReelSymbol(): void {
    this.reelImages.forEach((reel, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });
  }

  shuffleSymbol = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  spin() {
    this.spiningReelImages.forEach((reel, index) => {
      this.spiningReelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });

    this.reelImages.forEach((reel, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.reelImages[index]))
      );
    });

    this.isSpinning = !this.isSpinning;
  }
}
