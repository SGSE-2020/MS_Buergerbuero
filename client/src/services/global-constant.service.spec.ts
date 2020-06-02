import { TestBed } from '@angular/core/testing';

import { GlobalConstantService } from './global-constant.service';

describe('GlobalConstantService', () => {
  let service: GlobalConstantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalConstantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
