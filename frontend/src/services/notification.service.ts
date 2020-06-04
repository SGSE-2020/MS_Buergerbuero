import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, position: string){
    this.toastr.success(message, '', {
      timeOut: 5000,
      positionClass: position,
      closeButton: true
    });
  }

  showError(message: string, position: string){
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: position,
      closeButton: true
    });
  }

  showInfo(message: string, position: any){
    this.toastr.info(message, '', {
      timeOut: 5000,
      positionClass: position,
      closeButton: true
    });
  }

  showWarning(message: string, position: any){
    this.toastr.warning(message, '', {
      timeOut: 5000,
      positionClass: position,
      closeButton: true
    });
  }
}
