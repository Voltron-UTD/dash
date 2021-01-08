import { TestBed } from '@angular/core/testing';

import { BridgeServiceService } from './bridge-service.service';

describe('BridgeServiceService', () => {
  let service: BridgeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BridgeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
