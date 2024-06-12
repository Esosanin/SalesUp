import { TestBed } from '@angular/core/testing';

import { GastosViaticosService } from './gastos-viaticos.service';

describe('GastosViaticosService', () => {
  let service: GastosViaticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GastosViaticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
