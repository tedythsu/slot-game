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
  credits: number = 9999;
  insertCoinSound = new Audio('./assets/sound/mixkit-clinking-coins-1993.wav');
  spinSound = new Audio('./assets/sound/custom-slot-machine-spin-loop-sound-effect-241518954_nw_prev.m4a');

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

  get prefixCredits() {
    return this.prefixInteger(this.credits, 6);
  }

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
    if (this.credits > 0) {
      this.spinSound.pause();
      this.spinSound.currentTime = 0;
      this.spinSound.play();

      this.credits--;
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

    interval(800)
      .pipe(
        take(this.spinningReels.length),
        finalize(() => {
          this.checkForWin();
          this.isSpinning = false;
          this.checkAndToggleAutoSpin(true);
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
      setTimeout(() => {
        window.alert('WIN!');
      }, 0);

      this.checkAndToggleAutoSpin(false);
    }
  }

  private prefixInteger(num: number, length: number) {
    return (Array(length).join('0') + num).slice(-length);
  }

  public insertCoin() {
    if (this.insertCoinSound) {
      this.insertCoinSound.pause();
      this.insertCoinSound.currentTime = 0;
      this.insertCoinSound.play();
    }
    this.credits++;
  }

  private checkAndToggleAutoSpin(checkCredits: boolean) {
    if (checkCredits) {
      if (this.credits < 1 && this.isAutoMode) {
        this.toggleAutoSpin();
      }
    } else {
      if (this.isAutoMode) {
        this.toggleAutoSpin();
      }
    }
  }
}
