import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from './global-constant.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  announcementList: any;

  constructor(private constants: GlobalConstantService, private http: HttpClient) { }

  /**
   * Get all announcements
   */
  public async getAllAnnouncements(){
    const data = await this.http.get(this.constants.host + '/announcement').toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      this.announcementList = obj.param;
    } else {
      this.announcementList = [];
    }
  }
}
