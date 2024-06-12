import { TestBed } from '@angular/core/testing';

import { CapitalhumanoService } from './capitalhumano.service';

describe('CapitalhumanoService', () => {
  let service: CapitalhumanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalhumanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
