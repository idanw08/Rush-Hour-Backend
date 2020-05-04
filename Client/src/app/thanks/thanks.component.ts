import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service/data-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.css']
})
export class ThanksComponent implements OnInit {

  private workerId: string;
  //private ValidationCode:string;
  ValidationCode:string;
  toLoadPage: boolean = false;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http: HttpClient, private dataService: DataServiceService, private router:Router) {
  }

  async ngOnInit() {
    this.toLoadPage = await (sessionStorage.getItem('done') != null);
    if(this.toLoadPage){
      this.workerId = sessionStorage.getItem('currentId');
      this.getValidation();
      let workerBonus;
      this.dataService.currentBonus.subscribe(bonus => workerBonus = bonus);
      //console.log("Bonus " + workerBonus);//TO DELETE
      this.updateWorkerBonus(workerBonus);
    }
    else this.router.navigate(["/page-not-found"]);
  }

  updateWorkerBonus(workerBonus){
    let data =
    {
      "Parameter": "Bonus",
      "Data": workerBonus
    }
    //console.log("updateWorkerBonus" + JSON.stringify(data))//TO DELETE
    this.http.put<any>(this.dataService.apiUrl + "player/" + this.workerId, JSON.stringify(data), this.httpOptions)
    .subscribe(data => { 
      //console.log("PUT Request is successful ", data); 
    }, error => { 
      //console.log("Error", error); 
  }
    );
  }

  getValidation (){
    this.http.get<any>(this.dataService.apiUrl + "Validation?WorkerID=" + this.workerId).subscribe(data => this.ValidationCode = data.code);
  }
}
