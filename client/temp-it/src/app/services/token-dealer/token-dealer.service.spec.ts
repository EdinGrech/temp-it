import { TestBed } from '@angular/core/testing';

import { TokenDealerService } from './token-dealer.service';

describe('TokenDealerService', () => {
  let service: TokenDealerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenDealerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
