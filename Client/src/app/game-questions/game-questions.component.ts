import { DataServiceService } from '../data-service/data-service.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import $ from "jquery";

@Component({
  selector: 'app-game-questions',
  templateUrl: './game-questions.component.html',
  styleUrls: ['./game-questions.component.css']
})
export class GameQuestionsComponent implements OnInit {
  toShowForm: boolean = false;
  toDisable: boolean = false;
  myForm: FormGroup;
  extraForm: FormGroup;
  stage: number = 1;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  //number = document.getElementById('number');
  @Input() isWin: boolean;

  @Output() emitTheSubmitButton = new EventEmitter();

  constructor(private http: HttpClient, private fb: FormBuilder, private dataService: DataServiceService) {
  }

  ngOnInit() {
    this.isWin = false;
    this.myForm = this.fb.group({
      q1: ['', [
        Validators.required
      ]],
      q2: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      q3: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      q4: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      q5: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(1)
      ]],
      q6: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      q7: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      q8: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      q9: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      q10: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      q11: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]]
    });
    this.extraForm = this.fb.group({
      eq1: ['', [
        Validators.required
      ]],
      eq2: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      eq3: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      eq4: ['', [
        Validators.required,
        Validators.max(10),
        Validators.min(1)
      ]],
      eq5: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0)
      ]],
      eq6: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      eq7: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      eq8: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      eq9: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      eq10: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]],
      eq11: ['', [
        Validators.required,
        Validators.max(100),
        Validators.min(0),
      ]]
    });
  }

  get q1() {
    return this.myForm.get('q1');
  }

  get q2() {
    return this.myForm.get('q2');
  }

  get q3() {
    return this.myForm.get('q3');
  }

  get q4() {
    return this.myForm.get('q4');
  }

  get q5() {
    return this.myForm.get('q5');
  }

  get q6() {
    return this.myForm.get('q6');
  }

  get q7() {
    return this.myForm.get('q7');
  }

  get q8() {
    return this.myForm.get('q8');
  }

  get q9() {
    return this.myForm.get('q9');
  }

  get q10() {
    return this.myForm.get('q10');
  }

  get q11() {
    return this.myForm.get('q11');
  }
  
  get eq1() {
    return this.extraForm.get('eq1');
  }

  get eq2() {
    return this.extraForm.get('eq2');
  }

  get eq3() {
    return this.extraForm.get('eq3');
  }

  get eq4() {
    return this.extraForm.get('eq4');
  }

  get eq5() {
    return this.extraForm.get('eq5');
  }

  get eq6() {
    return this.extraForm.get('eq6');
  }

  get eq7() {
    return this.extraForm.get('eq7');
  }

  get eq8() {
    return this.extraForm.get('eq8');
  }

  get eq9() {
    return this.extraForm.get('eq9');
  }
  
  get eq10() {
    return this.extraForm.get('eq10');
  }  
  
  get eq11() {
    return this.extraForm.get('eq11');
  }

  async onSubmit() {
    this.stage++;
    await this.emitTheSubmitButton.emit('submitClicked');
    this.isWin = false;
    this.toShowForm = false;
    this.myForm.reset();
    window.scroll(0, 0);
  }

  onSubmitCheck(){
    if (this.stage != 1){
      this.onSubmit();
    }
    else {
      document.getElementById("ff").style.display = "none";
      window.scroll(0, 0);
      this.toShowForm = true;}

  }

  async onSubmitExtraForm(){
    let data = {
      WorkerID: sessionStorage.getItem('currentId'),
      InstanceIndex: 4,
      Log: {},
      QnsAns: [
        {
          Question: "Q1",
          Answer: this.extraForm.value.eq1
        },
        {
          Question: "Q2",
          Answer: parseInt(this.extraForm.value.eq2)
        },
        {
          Question: "Q3",
          Answer: parseInt(this.extraForm.value.eq3)
        },
        {
          Question: "Q4",
          Answer: parseInt(this.extraForm.value.eq4)
        },
        {
          Question: "Q5",
          Answer: parseInt(this.extraForm.value.eq5)
        },
        {
          Question: "Q6",
          Answer: parseInt(this.extraForm.value.eq6)
        },
        {
          Question: "Q7",
          Answer: parseInt(this.extraForm.value.eq7)
        },
        {
          Question: "Q8",
          Answer: parseInt(this.extraForm.value.eq8)
        },
        {
          Question: "Q9",
          Answer: parseInt(this.extraForm.value.eq9)
        },        
        {
          Question: "Q10",
          Answer: parseInt(this.extraForm.value.eq10)
        },
        {
          Question: "Q11",
          Answer: parseInt(this.extraForm.value.eq11)
        }
      ]
      }
      await this.addInstanceData(data);
      this.extraForm.reset();
      document.getElementById("ff").style.display = "block";
      this.onSubmit();
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

  getAns() {
    return this.myForm.value;
  }

  blurPercent(id){
    $('#' + id).val($('#' + id).val() + '%');
  }
  focusPercent(id){
    $('#' + id).val(
      function(index, value){
          return value.substr(0, value.length - 1);
        })
  }

  selectOptions(stage: number){
    let stringOptions: string;
    if (stage == 1) {
      stringOptions = "Less then 7 moves,7 moves,8 moves,9 moves,10 moves,More then 10 moves";
    } else if (stage == 2) {
      stringOptions = "Less then 13 moves,13 moves,14 moves,15 moves,16 moves,More then 16 moves";
    } else if (stage == 3) {
      stringOptions = "Less then 17 moves,17 moves,18 moves,19 moves,20 moves,More then 20 moves";
    } else if (stage == 4){
      stringOptions = "Picture A,Picture B,Picture C,Picture D,Picture E,Picture F";
    }
    return stringOptions.split(",");
  }

  percentage(form) {
    if (form == 0)
      return (parseInt(this.q6.value) + parseInt(this.q7.value) + parseInt(this.q8.value) + parseInt(this.q9.value) + parseInt(this.q10.value) + parseInt(this.q11.value));
    if (form == 1)
      return (parseInt(this.eq6.value) + parseInt(this.eq7.value) + parseInt(this.eq8.value) + parseInt(this.eq9.value) + parseInt(this.eq10.value) + parseInt(this.eq11.value));
  }

  percentageLeft(form) {
    if (form == 0){
      let left =  100 - (parseInt(this.q6.value) + parseInt(this.q7.value) + parseInt(this.q8.value) + parseInt(this.q9.value) + parseInt(this.q10.value) + parseInt(this.q11.value));
      if(left>0) return "You left " + left + "% to divide."
      if(left<0) return "Get rid of " + (-left) + "%."
    }
    if (form == 1){
      let left = 100 - (parseInt(this.eq6.value) + parseInt(this.eq7.value) + parseInt(this.eq8.value) + parseInt(this.eq9.value) + parseInt(this.eq10.value) + parseInt(this.eq11.value));
      if(left>0) return "You left " + left + "% to divide."
      if(left<0) return "Get rid of " + (-left) + "%."
    }
  }

  onkeydown(e) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 9)) {
      return false;
    }
  }
}