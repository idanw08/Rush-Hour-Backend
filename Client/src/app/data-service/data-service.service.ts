import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  apiUrl = '/';
  private workerId = new BehaviorSubject<string>("unknown");
  currentWorkerId = this.workerId.asObservable();
  private currentId = "unknown";
  private bonus = new BehaviorSubject<number>(0.0);
  currentBonus = this.bonus.asObservable();

  private isTermsAgreed = new BehaviorSubject<boolean>(false);
  currentTermsAgreed = this.isTermsAgreed.asObservable();

  constructor(private router:Router) { 
  }

  changeWorkerId(id: string){
    sessionStorage.setItem('currentId', id);
  }

  changeBonus(bonus: number){
    this.bonus.next(bonus);
  }

  changeIsTermsAgreed(isTermsAgreed: boolean){
    this.isTermsAgreed.next(isTermsAgreed);
  }

  changePlayed(played: string){
    sessionStorage.setItem('played', played);
  }

  changeDone(done: string){
    sessionStorage.setItem('done', done);
  }

  notAuthorized = (inGame: boolean) =>{
    if(sessionStorage.getItem('currentId') == null || (sessionStorage.getItem('played') == "true" && inGame)){
      this.router.navigate(["/page-not-found"]);
      return false;
    }
    return true;
  }
}
