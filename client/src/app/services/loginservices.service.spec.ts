import { TestBed } from '@angular/core/testing';

import { LoginservicesService } from './loginservices.service';

describe('LoginservicesService', () => {
  let service: LoginservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
