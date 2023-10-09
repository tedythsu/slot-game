import { Component, OnInit } from '@angular/core';
import { Subscription, finalize, interval, take } from 'rxjs';

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
  reelImages = [[], [], []];
  isSpinning: boolean = false;
  isAutoMode: boolean = false;
  spinningReels = [false, false, false];
  autoSpinIntervalSubscription: Subscription = new Subscription();

  images: string[] = [
    SlotSymbols.Cherries,
    SlotSymbols.Cherries,
    SlotSymbols.Lemon,
    SlotSymbols.Lemon,
    SlotSymbols.Orange,
    SlotSymbols.Orange,
    SlotSymbols.Bar,
    SlotSymbols.Seven,
  ];

  ngOnInit(): void {
    this.initReelSymbol();
  }

  private initReelSymbol(): void {
    this.reelImages.forEach((_, index) => {
      this.reelImages[index] = JSON.parse(
        JSON.stringify(this.shuffleSymbol(this.images))
      );
    });

    console.log('Reel', this.reelImages);
  }

  private shuffleSymbol = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  public spin() {
    this.isSpinning = true;

    this.spinningReels.forEach((_, index) => {
      this.spinningReels[index] = true;
    });

    this.reelImages.forEach((_, index) => {
      const moveIndex = Math.floor(Math.random() * 8);

      if (moveIndex !== 0) {
        let newReel = [...this.reelImages[index]];

        this.reelImages[index].forEach((image, index) => {
          const resultIndex = index + moveIndex;

          if (resultIndex > 7) {
            newReel[resultIndex - 8] = image;
          } else {
            newReel[resultIndex] = image;
          }
        });

        this.reelImages[index] = newReel;
      }
    });

    console.log('New Reels', this.reelImages);

    this.stopSpin();
  }

  public toggleAutoSpin() {
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

  private stopSpin() {
    let spinningReelIndex = 0;

    interval(1000)
      .pipe(
        take(this.spinningReels.length),
        finalize(() => {
          this.checkForWin();
          this.isSpinning = false;
        })
      )
      .subscribe((_) => {
        this.spinningReels[spinningReelIndex] = false;
        spinningReelIndex++;
      });
  }

  private checkForWin() {
    if (
      this.reelImages[0][1] === this.reelImages[1][1] &&
      this.reelImages[0][1] === this.reelImages[2][1]
    ) {
      console.log('WIN');
      if (this.isAutoMode) {
        this.toggleAutoSpin();
      }
    }
  }
}
