import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PushNotificationPage } from './push-notification.page';

describe('PushNotificationPage', () => {
  let component: PushNotificationPage;
  let fixture: ComponentFixture<PushNotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PushNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
