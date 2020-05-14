import { Component, OnInit } from '@angular/core';
import {GlobalConstantsService} from '../../app/global-constants.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  constructor(public constants: GlobalConstantsService) { }

  ngOnInit(): void {
  }

}
