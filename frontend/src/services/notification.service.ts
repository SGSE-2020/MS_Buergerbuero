import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toast: ToastrService) { }

  /**
   * Show success message with toast notification
   * @param message message to show
   * @param position position to open the toast notification at
   */
  showSuccess(message: string, position: string){
    this.toast.success(message, '', {
      positionClass: position
    });
  }

  /**
   * Show error message with toast notification
   * @param message message to show
   * @param position position to open the toast notification at
   */
  showError(message: string, position: string){
    this.toast.error(message, '', {
      positionClass: position
    });
  }

  /**
   * Show warning message with toast notification
   * @param message message to show
   * @param position position to open the toast notification at
   */
  showWarning(message: string, position: any){
    this.toast.warning(message, '', {
      positionClass: position
    });
  }
}
