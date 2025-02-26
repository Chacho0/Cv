import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearCurriculumPage } from './crear-curriculum.page';

describe('CrearCurriculumPage', () => {
  let component: CrearCurriculumPage;
  let fixture: ComponentFixture<CrearCurriculumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCurriculumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
