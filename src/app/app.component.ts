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
  jackpotSound = new Audio('./assets/sound/coins-jackpot-3-sound-effect-146321209_nw_prev.m4a');
  isTopLineMatched: boolean = false;
  isMiddleLineMatched: boolean = false;
  isBottomLineMatched: boolean = false;
  bet = 3;
  winnerPaid = 0;

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

  get prefixBet() {
    return this.prefixInteger(this.bet, 2);
  }

  get prefixWinnerPaid() {
    return this.prefixInteger(this.winnerPaid, 6);
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
      this.resetMatchStatus();
      this.spinSound.volume = 0.25;
      this.spinSound.currentTime = 0;
      this.spinSound.play();

      this.credits -= this.bet;
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

    interval(850)
      .pipe(
        take(this.spinningReels.length),
        finalize(() => {
          this.spinSound.pause();
          this.evaluateWinningLines();
          this.isSpinning = false;
          this.checkAndToggleAutoSpin(true);
        })
      )
      .subscribe((_) => {
        this.spinningReels[spinningReelIndex] = false;
        spinningReelIndex++;
      });
  }

  private evaluateWinningLines(): void {
    let winnerPaid = 0;

    const lineChecks = [
      { index: 0, matchVariable: 'isTopLineMatched' },
      { index: 1, matchVariable: 'isMiddleLineMatched' },
      { index: 2, matchVariable: 'isBottomLineMatched' }
    ];

    lineChecks.forEach(line => {
      if (
        this.reelSets[0][line.index] === this.reelSets[1][line.index] &&
        this.reelSets[0][line.index] === this.reelSets[2][line.index]
      ) {
        this.jackpotSound.play();
        (this as any)[line.matchVariable] = true;
        const payout = this.getPayoutForSymbol(this.reelSets[0][line.index]);
        winnerPaid += this.bet * payout;
      }
    });

    this.winnerPaid = winnerPaid;
    this.credits += this.winnerPaid;
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

  private resetMatchStatus(): void {
    this.isTopLineMatched = false;
    this.isMiddleLineMatched = false;
    this.isBottomLineMatched = false;
  }

  private getPayoutForSymbol(symbol: string): number {
    switch (symbol) {
      case SlotSymbols.CHERRIES:
        return 5;
      case SlotSymbols.LEMON:
        return 10;
      case SlotSymbols.ORANGE:
        return 15;
      case SlotSymbols.WATERMELON:
        return 20;
      case SlotSymbols.BAR:
        return 25;
      case SlotSymbols.SEVEN:
        return 50;
      default:
        return 0;
    }
  }
}
