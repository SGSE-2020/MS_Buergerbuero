import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../../app/global-constants.service';

@Component({
  selector: 'app-black-board',
  templateUrl: './black-board.component.html',
  styleUrls: ['./black-board.component.css']
})
export class BlackBoardComponent implements OnInit {

  constructor(public constants: GlobalConstantsService) { }

  ngOnInit(): void {
  }

}
