import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumDetailsPage } from './curriculum-details.page';

describe('CurriculumDetailsPage', () => {
  let component: CurriculumDetailsPage;
  let fixture: ComponentFixture<CurriculumDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
