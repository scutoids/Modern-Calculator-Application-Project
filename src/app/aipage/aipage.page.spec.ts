import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AIpagePage } from './aipage.page';

describe('AIpagePage', () => {
  let component: AIpagePage;
  let fixture: ComponentFixture<AIpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AIpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
