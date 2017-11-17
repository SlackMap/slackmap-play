'use strict';
/** Imports */
require('pixi');
require('p2');
require('phaser');

// import './styles.css';
import { SetupState } from './states/setup.state';
import { PreloaderState } from './states/preloader.state';


class App {
  game: Phaser.Game;
  logo: Phaser.Sprite;
  cursors: Phaser.CursorKeys;

  constructor() {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', this);

    this.game.state.add('SetupState', SetupState, false);
    this.game.state.add('PreloaderState', PreloaderState, false);
    this.game.state.start('PreloaderState', true, true);
  }

  preload() {
    this.game.load.image('logo', 'assets/phaser-logo-small.png');
  }


}

window.onload = () => {
  let game = new App();
};
