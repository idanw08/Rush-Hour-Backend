import { DataServiceService } from '../data-service/data-service.service';
import { GameQuestionsComponent } from './../game-questions/game-questions.component';
import { Router } from '@angular/router';
import { GameInstancesComponent } from './../game-instances/game-instances.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isWin: boolean;
  stageNum: number;
  workerId: String;
  @ViewChild(GameInstancesComponent, { static: false }) childGameInstance;
  @ViewChild(GameQuestionsComponent, { static: false }) childGameQuestions;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  toLoadPage: boolean = false;

  constructor(private http: HttpClient, private router: Router, private dataService: DataServiceService) {
  }

  async ngOnInit() {
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });
    this.toLoadPage = await this.dataService.notAuthorized(true);
    if(this.toLoadPage){
      this.dataService.changePlayed("true");
      this.workerId = sessionStorage.getItem('currentId');
      window.scroll(0, 0);
      this.stageNum = 0;
    }
  }

  handleWinIsTrue() {
    this.isWin = true;
  }

  async handleSubmitClicked() {
    let log = this.childGameInstance.getLog();
    let ans = this.childGameQuestions.getAns();
    let data = {
      WorkerID: this.workerId,
      InstanceIndex: this.stageNum + 1,
      Log: log,
      QnsAns: [
        {
          Question: "Q1",
          Answer: ans.q1
        },
        {
          Question: "Q2",
          Answer: parseInt(ans.q2)
        },
        {
          Question: "Q3",
          Answer: parseInt(ans.q3)
        },
        {
          Question: "Q4",
          Answer: parseInt(ans.q4)
        },
        {
          Question: "Q5",
          Answer: parseInt(ans.q5)
        },
        {
          Question: "Q6",
          Answer: parseInt(ans.q6)
        },
        {
          Question: "Q7",
          Answer: parseInt(ans.q7)
        },
        {
          Question: "Q8",
          Answer: parseInt(ans.q8)
        },
        {
          Question: "Q9",
          Answer: parseInt(ans.q9)
        }
      ]
    }
    //console.log(data);
    let gameBonus = this.childGameInstance.getBonus();
    //console.log(gameBonus);
    this.dataService.currentBonus.subscribe(bonus => gameBonus += bonus);
    this.dataService.changeBonus(gameBonus);
    await this.addInstanceData(data);
    this.isWin = false;
    this.stageNum++;
    if (this.stageNum != 3) {
      this.childGameInstance.newGame(this.stageNum);
    }
    else {
      this.done();
    }
  }

  done() {
    this.dataService.changeDone("true");
    this.router.navigate(["/thanks"]);
  }

  addInstanceData(data) {
    //console.log(JSON.stringify(data));
    return this.http.post(this.dataService.apiUrl + "player/instance_data", JSON.stringify(data), this.httpOptions)
      .subscribe(data => { 
        //console.log("POST Request is successful ", data); 
      }, error => { 
        //console.log("Error", error); 
      }
      );
  }
  
}
