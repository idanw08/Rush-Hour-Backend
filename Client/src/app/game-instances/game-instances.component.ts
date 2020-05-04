import { RushHourGame } from '../rush-hour-game/rush-hour-game';
import Phaser from 'phaser-ce';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-instances',
  templateUrl: './game-instances.component.html',
  styleUrls: ['./game-instances.component.css']
})
export class GameInstancesComponent implements OnInit {

  @Output() emitTheWinIsTrueEvent = new EventEmitter();

  game: RushHourGame;
  winInterval;
  stage;
  @Input() stageNumber:number;

  constructor() {
  }

  ngOnInit() {
    this.game = new RushHourGame('gameDiv', 'easy');
    this.winInterval =  setInterval(() => { 
      if(this.game.gameScene.isDone()){
        this.emitTheWinIsTrueEvent.emit('winIsTrue');
        clearInterval(this.winInterval);
      }
    }, 1000);
  }

  public getLog(){
    return this.game.gameScene.getGameLog();
  }

  public getBonus(){
    return this.game.gameScene.getBonus();
  }

  public newGame(n){
    if(n == 1) this.stage = 'medium';
    else if(n == 2) this.stage = 'hard';
    this.game.game.destroy();
    this.game = new RushHourGame('gameDiv', this.stage);
    this.winInterval = setInterval(() => { 
      if(this.game.gameScene.isDone()){
        this.emitTheWinIsTrueEvent.emit('winIsTrue');
        clearInterval(this.winInterval);
      }
    }, 1000);
  }
}