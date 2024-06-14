import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaPersonaPage } from './alta-persona.page';

describe('AltaPersonaPage', () => {
  let component: AltaPersonaPage;
  let fixture: ComponentFixture<AltaPersonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPersonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
