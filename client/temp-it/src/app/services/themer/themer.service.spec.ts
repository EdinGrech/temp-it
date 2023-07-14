import { TestBed } from '@angular/core/testing';

import { ThemerService } from './themer.service';

describe('ThemerService', () => {
  let service: ThemerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
