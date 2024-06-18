import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUsrPendientesPage } from './list-usr-pendientes.page';

describe('ListUsrPendientesPage', () => {
  let component: ListUsrPendientesPage;
  let fixture: ComponentFixture<ListUsrPendientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsrPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
