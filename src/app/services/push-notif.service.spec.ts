import { TestBed } from '@angular/core/testing';

import { PushNotifService } from './push-notif.service';

describe('PushNotifService', () => {
  let service: PushNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
