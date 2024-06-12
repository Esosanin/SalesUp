import { TestBed } from '@angular/core/testing';

import { SalesupService } from './salesup.service';

describe('SalesupService', () => {
  let service: SalesupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
