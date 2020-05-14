import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../../app/global-constants.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  constructor(public constants: GlobalConstantsService) { }

  ngOnInit(): void {
  }

}
