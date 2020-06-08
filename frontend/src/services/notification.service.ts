import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, position: string){
    this.toastr.success(message, '', {
      positionClass: position,
    });
  }

  showError(message: string, position: string){
    this.toastr.error(message, '', {
      positionClass: position,
    });
  }

  showInfo(message: string, position: any){
    this.toastr.info(message, '', {
      positionClass: position,
    });
  }

  showWarning(message: string, position: any){
    this.toastr.warning(message, '', {
      positionClass: position,
    });
  }
}
