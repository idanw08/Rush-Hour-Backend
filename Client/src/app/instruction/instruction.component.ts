import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RushHourGame } from '../rush-hour-game/rush-hour-game';
import { DataServiceService } from '../data-service/data-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit{

  private game:RushHourGame;
  solved: boolean = false;
  frame: number;
  winInterval;
  workerId: String;
  isSubmitted = false;
  toLoadPage:boolean = false;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  IsChecked: boolean;
  IsChecked1: boolean;
  IsChecked2: boolean;

  constructor(private dataService: DataServiceService,private fb: FormBuilder, private router: Router,private http: HttpClient) { }

  async ngOnInit() {
    this.toLoadPage = await this.dataService.notAuthorized(false);
    if(this.toLoadPage){
      this.workerId = sessionStorage.getItem('currentId');
      window.scroll(0,0);
      this.frame = 0;
      this.example();
    }
  }

  example(){
    this.game = new RushHourGame('gameDiv', 'example');
    this.winInterval = setInterval(() => { 
      if(this.game.gameScene.isDone()){
        this.solved = true;
        clearInterval(this.winInterval);
      }
    }, 2000);
  }

  nextFrame = () => {
    //this.game.game.destroy();
    document.getElementById("gameDiv").style.display = "none";
    this.frame++;
    window.scroll(0,0);
  }

  previousFrame = () => {
    document.getElementById("gameDiv").style.display = "block";
    this.frame--;
    window.scroll(0,0);
  }

  familiarityForm = this.fb.group({
    familiarity: ['', [
      Validators.required
    ]]
  });

  get familiarity() {
    return this.familiarityForm.get('familiarity');
  }

  startQuestionnaire() {
    this.updateWorkerFamiliarity(this.familiarity.value);
    this.router.navigate(["/game"]);
  }

  updateWorkerFamiliarity(workerFamiliarity){
    let data =
    {
      "Parameter": "Familiarity",
      "Data": workerFamiliarity
    }
    //console.log("updateWorkerFamiliarity" + JSON.stringify(data))//TO DELETE
    this.http.put<any>(this.dataService.apiUrl + "player/" + this.workerId,JSON.stringify(data), this.httpOptions)
    .subscribe(data => { 
      //console.log("PUT Request is successful ", data); 
    }, error => { 
      //console.log("Error", error); 
    }
    );
  }
}
