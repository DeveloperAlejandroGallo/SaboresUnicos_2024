import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDuenioPage } from './tab-duenio.page';

describe('TabDuenioPage', () => {
  let component: TabDuenioPage;
  let fixture: ComponentFixture<TabDuenioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDuenioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
