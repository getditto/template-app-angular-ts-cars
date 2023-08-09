import { TestBed } from '@angular/core/testing';

import { DittoService } from './ditto.service';

describe('DittoService', () => {
  let service: DittoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DittoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
