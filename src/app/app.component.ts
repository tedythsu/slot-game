import { Component, OnInit } from '@angular/core';
import { Subscription, interval, timer } from 'rxjs';

enum SlotSymbols {
  Cherries = './assets/images/cherries.png',
  Lemon = './assets/images/lemon.png',
  Orange = './assets/images/orange.png',
  Watermelon = './assets/images/watermelon.png',
  Bar = './assets/images/bar.png',
  Seven = './assets/images/seven.png',
}

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
    SlotSymbols.Cherries,
    SlotSymbols.Cherries,
    SlotSymbols.Cherries,
    SlotSymbols.Lemon,
    SlotSymbols.Lemon,
    SlotSymbols.Lemon,
    SlotSymbols.Orange,
    SlotSymbols.Orange,
    SlotSymbols.Orange,
    SlotSymbols.Bar,
    SlotSymbols.Bar,
    SlotSymbols.Seven,
  ];

  reelImages = [[], [], []];

  ngOnInit(): void {
    this.initReelSymbol();
  }

  initReelSymbol(): void {
    this.reelImages.forEach((_, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });

    console.log('Reel', this.reelImages);
  }

  shuffleSymbol = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  spin() {
    this.isSpinning = true;

    this.reelImages.forEach((_, index) => {
      const moveIndex = Math.floor(Math.random() * 12);

      if (moveIndex !== 0) {
        let newReel = [...this.reelImages[index]];

        this.reelImages[index].forEach((image, index) => {
          const resultIndex = index + moveIndex;

          if (resultIndex > 11) {
            newReel[resultIndex - 12] = image;
          } else {
            newReel[resultIndex] = image;
          }
        });

        this.reelImages[index] = newReel;
      }
    });

    console.log('New Reels', this.reelImages);

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
