import { TestBed } from '@angular/core/testing';

import { HttpHeaddersInterceptor } from './http-headders.interceptor';

describe('HttpHeaddersInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpHeaddersInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: HttpHeaddersInterceptor = TestBed.inject(
      HttpHeaddersInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
