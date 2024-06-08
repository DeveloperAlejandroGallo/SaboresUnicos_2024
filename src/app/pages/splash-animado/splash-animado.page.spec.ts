import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashAnimadoPage } from './splash-animado.page';

describe('SplashAnimadoPage', () => {
  let component: SplashAnimadoPage;
  let fixture: ComponentFixture<SplashAnimadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashAnimadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
