import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeTabsPage } from './home-tabs.page';

describe('HomeTabsPage', () => {
  let component: HomeTabsPage;
  let fixture: ComponentFixture<HomeTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
