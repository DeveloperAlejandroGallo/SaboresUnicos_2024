import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestasGraficoPage } from './encuestas-grafico.page';

describe('EncuestasGraficoPage', () => {
  let component: EncuestasGraficoPage;
  let fixture: ComponentFixture<EncuestasGraficoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestasGraficoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
