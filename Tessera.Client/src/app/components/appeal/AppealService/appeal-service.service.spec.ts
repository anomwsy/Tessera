import { TestBed } from '@angular/core/testing';

import { AppealService } from './appeal.service';

describe('AppealServiceService', () => {
  let service: AppealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
