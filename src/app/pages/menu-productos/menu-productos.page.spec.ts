import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuProductosPage } from './menu-productos.page';

describe('MenuProductosPage', () => {
  let component: MenuProductosPage;
  let fixture: ComponentFixture<MenuProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
