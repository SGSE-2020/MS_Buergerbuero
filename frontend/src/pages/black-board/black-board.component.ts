import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-black-board',
  templateUrl: './black-board.component.html',
  styleUrls: ['./black-board.component.css']
})
export class BlackBoardComponent implements OnInit {
  currentAnnouncement: any;
  currentFoundObject: any;
  receiveFoundObjectForm: any;

  announcementList: any;
  foundObjectList: any;

  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private formBuilder: FormBuilder,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.announcementList = [];
    this.foundObjectList = [];
    this.receiveFoundObjectForm = this.formBuilder.group({
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required]
    });

    this.getAllActiveAnnouncements().then( result => {
      this.constants.activeAnnouncementList = result;
      this.announcementList = this.constants.activeAnnouncementList.filter((a) => a.type === 'announcement');
      this.foundObjectList = this.constants.activeAnnouncementList.filter((a) =>  a.type === 'found object');
    });
  }

  /**
   * Get all active announcements
   */
   async getAllActiveAnnouncements(){
     const data = await this.http.get(this.constants.host + '/announcement/active').toPromise();
     const obj = JSON.parse(JSON.stringify(data));
     if (obj.status === 'success'){
       return obj.param.announcements;
     } else {
       return [];
     }
  }

  /**
   * Open detail view of clicked announcement
   * @param modalContent announcementDetail modal
   * @param announcement Announcement that was selected
   */
  openAnnouncementDetailView(modalContent: any, announcement: any) {
    this.modalService.open(modalContent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    this.currentAnnouncement = announcement;
  }

  /**
   * Open detail view of clicked found object
   * @param modalContent foundObjectDetail modal
   * @param foundObject Found object that was selected
   */
  openFoundObjectDetailView(modalContent: any, foundObject: any) {
    this.modalService.open(modalContent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    this.currentFoundObject = foundObject;
  }

  /**
   * Function to receive a found object
   */
  receiveFoundObject() {
    // todo check if validation is okay
    // todo if successful remove announcement
  }
}
