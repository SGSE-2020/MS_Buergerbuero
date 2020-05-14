import { Component, OnInit } from '@angular/core';
import {GlobalConstantsService} from '../../app/global-constants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public constants: GlobalConstantsService) { }

  ngOnInit(): void {
  }

}
