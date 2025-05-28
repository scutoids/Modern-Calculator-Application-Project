import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Math3DPage } from './math3-d.page';

describe('Math3DPage', () => {
  let component: Math3DPage;
  let fixture: ComponentFixture<Math3DPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Math3DPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
