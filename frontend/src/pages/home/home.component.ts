import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public constants: GlobalConstantService) { }

  ngOnInit(): void {
  }

}
