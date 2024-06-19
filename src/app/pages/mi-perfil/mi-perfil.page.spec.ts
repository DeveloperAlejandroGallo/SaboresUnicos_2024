import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiPerfilPage } from './mi-perfil.page';

describe('MiPerfilPage', () => {
  let component: MiPerfilPage;
  let fixture: ComponentFixture<MiPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
