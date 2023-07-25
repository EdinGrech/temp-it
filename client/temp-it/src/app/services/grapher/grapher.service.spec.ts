import { TestBed } from '@angular/core/testing';

import { GrapherService } from './grapher.service';

describe('GrapherService', () => {
  let service: GrapherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrapherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
