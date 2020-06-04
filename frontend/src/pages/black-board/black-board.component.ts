import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';

@Component({
  selector: 'app-black-board',
  templateUrl: './black-board.component.html',
  styleUrls: ['./black-board.component.css']
})
export class BlackBoardComponent implements OnInit {

  constructor(public constants: GlobalConstantService) { }

  ngOnInit(): void {
  }

}
