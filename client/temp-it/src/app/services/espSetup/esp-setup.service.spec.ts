import { TestBed } from '@angular/core/testing';

import { EspSetupService } from './esp-setup.service';

describe('EspSetupService', () => {
  let service: EspSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
