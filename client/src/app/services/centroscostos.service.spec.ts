import { TestBed } from '@angular/core/testing';

import { CentroscostosService } from './centroscostos.service';

describe('CentroscostosService', () => {
  let service: CentroscostosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroscostosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
