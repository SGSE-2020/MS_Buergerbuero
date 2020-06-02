import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  constructor(public constants: GlobalConstantService) { }

  ngOnInit(): void {
  }

}
