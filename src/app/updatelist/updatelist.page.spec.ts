import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatelistPage } from './updatelist.page';

describe('UpdatelistPage', () => {
  let component: UpdatelistPage;
  let fixture: ComponentFixture<UpdatelistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
