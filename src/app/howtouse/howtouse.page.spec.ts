import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowtousePage } from './howtouse.page';

describe('HowtousePage', () => {
  let component: HowtousePage;
  let fixture: ComponentFixture<HowtousePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
