import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class GlobalConstantsService {
  public currentUser = null;
  public userRole = 0;

  constructor() { }
}
