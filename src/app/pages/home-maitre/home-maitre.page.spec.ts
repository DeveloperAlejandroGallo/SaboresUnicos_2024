import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMaitrePage } from './home-maitre.page';

describe('HomeMaitrePage', () => {
  let component: HomeMaitrePage;
  let fixture: ComponentFixture<HomeMaitrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMaitrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
