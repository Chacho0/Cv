import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerCurriculumPage } from './ver-curriculum.page';

describe('VerCurriculumPage', () => {
  let component: VerCurriculumPage;
  let fixture: ComponentFixture<VerCurriculumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCurriculumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
