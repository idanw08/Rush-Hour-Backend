import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {

  IsChecked: boolean;
  
  constructor(private dataService: DataServiceService, private router: Router) {
  }

  ngOnInit() {
  }

  agreed(){
    this.dataService.changeIsTermsAgreed(true)
    this.router.navigate(["/demographicQuestionnaire"]);
  }
}
