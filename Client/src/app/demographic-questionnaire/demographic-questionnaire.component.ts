import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataServiceService } from '../data-service/data-service.service';
import { WorkerIDValidator } from './workerID.validator'

import countryP from 'country-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demographic-questionnaire',
  templateUrl: './demographic-questionnaire.component.html',
  styleUrls: ['./demographic-questionnaire.component.css']
})
export class DemographicQuestionnaireComponent implements OnInit {
  myForm: FormGroup;
  workerId: String;
  //country_list = countryP.getNames();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
  };

  constructor(private http: HttpClient, private fb: FormBuilder, private dataService: DataServiceService, private router: Router) {
  }

  ngOnInit() {
    window.scroll(0,0);
    this.myForm = this.fb.group({
      WorkerID: ['', [
        Validators.required,
        WorkerIDValidator.cannotContainSpace
      ]],
      Age: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.min(18),
        Validators.max(120)
      ]],
      Gender: ['', [
        Validators.required
      ]],
      Education: ['', [
        Validators.required
      ]]/* ,
      Country: ['', [
        Validators.required
      ]] */
    });
  }

  get WorkerID() {
    return this.myForm.get('WorkerID');
  }

  get Gender() {
    return this.myForm.get('Gender');
  }

  get Education() {
    return this.myForm.get('Education');
  }

  get Age() {
    return this.myForm.get('Age');
  }

  onkeydown(e) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 9)) {
      return false;
    }
  }

  addUser() {
    this.dataService.changeWorkerId(this.myForm.value.WorkerID);
    return this.http.post(this.dataService.apiUrl + "players", JSON.stringify(this.myForm.value),this.httpOptions)
    .subscribe(
      data  => {
        //console.log("POST Request is successful ", data);
        sessionStorage.setItem('currentId', this.WorkerID.value);
        this.router.navigate(["/instruction"]);
      },
      error  => {
        if(error.error == 'Player not created - WorkerID already exist. The conditional request failed'){
          alert("Worker ID '" + this.WorkerID.value + "' is already exist.")
        }
      }
      );
  }
}
