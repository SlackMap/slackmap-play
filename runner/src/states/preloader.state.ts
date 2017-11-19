import { PreloadBar } from '../entities/preload-bar';


export class PreloaderState extends Phaser.State {

  loadingBar: PreloadBar;

  preload() {
    this.loadingBar = new PreloadBar(this.game);
    this.load.image('logo', 'assets/phaser-logo-small.png');
  }

  create() {
    this.loadingBar.setFillPercent(100);
    let tween = this.game.add.tween(this.loadingBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(this.startGame, this);
  }

  startGame() {
    this.game.state.start('SetupState', true);
  }

  loadUpdate() {
    this.loadingBar.setFillPercent(this.load.progress);

  }


}
