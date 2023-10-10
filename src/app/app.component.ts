import { Component, OnInit } from '@angular/core';
import { Subscription, finalize, interval, take } from 'rxjs';

enum SlotSymbols {
  CHERRIES = './assets/images/cherries.png',
  LEMON = './assets/images/lemon.png',
  ORANGE = './assets/images/orange.png',
  WATERMELON = './assets/images/watermelon.png',
  BAR = './assets/images/bar.png',
  SEVEN = './assets/images/seven.png',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  reelSets = [[], [], []];
  isSpinning: boolean = false;
  isAutoMode: boolean = false;
  spinningReels = [false, false, false];
  autoSpinIntervalSubscription: Subscription = new Subscription();

  slotImages: string[] = [
    SlotSymbols.CHERRIES,
    SlotSymbols.CHERRIES,
    SlotSymbols.LEMON,
    SlotSymbols.LEMON,
    SlotSymbols.ORANGE,
    SlotSymbols.ORANGE,
    SlotSymbols.BAR,
    SlotSymbols.SEVEN,
  ];

  slotImageCount: number = this.slotImages.length;

  ngOnInit(): void {
    this.initializeReelSymbols();
  }

  private initializeReelSymbols(): void {
    this.reelSets.forEach((_, index) => {
      this.reelSets[index] = JSON.parse(
        JSON.stringify(this.shuffleArray(this.slotImages))
      );
    });

    console.log('Reel Sets', this.reelSets);
  }

  private shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  public spin() {
    this.isSpinning = true;

    this.spinningReels.forEach((_, index) => {
      this.spinningReels[index] = true;
    });

    this.reelSets.forEach((_, index) => {
      const moveIndex = Math.floor(Math.random() * this.slotImageCount);

      if (moveIndex !== 0) {
        let newReel = [...this.reelSets[index]];

        this.reelSets[index].forEach((image, index) => {
          const resultIndex = index + moveIndex;

          if (resultIndex >= this.slotImageCount) {
            newReel[resultIndex - this.slotImageCount] = image;
          } else {
            newReel[resultIndex] = image;
          }
        });

        this.reelSets[index] = newReel;
      }
    });

    console.log('New Reel Sets', this.reelSets);

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
      this.reelSets[0][1] === this.reelSets[1][1] &&
      this.reelSets[0][1] === this.reelSets[2][1]
    ) {
      console.log('WIN');
      if (this.isAutoMode) {
        this.toggleAutoSpin();
      }
    }
  }
}
