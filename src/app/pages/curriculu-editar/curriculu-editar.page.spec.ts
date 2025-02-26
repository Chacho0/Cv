import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculuEditarPage } from './curriculu-editar.page';

describe('CurriculuEditarPage', () => {
  let component: CurriculuEditarPage;
  let fixture: ComponentFixture<CurriculuEditarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculuEditarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
