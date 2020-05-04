import Phaser from 'phaser-ce';
import { GameState } from './game-state';

export class RushHourGame {
    public game: Phaser.Game;
    public gameScene: GameState;

    constructor(str: string, instance: string) {
        this.game = new Phaser.Game(640, 640, Phaser.AUTO, str);
        this.gameScene = new GameState(instance);
        this.game.state.add("PlayGame", this.gameScene);
        this.game.state.start("PlayGame");
    }
}
