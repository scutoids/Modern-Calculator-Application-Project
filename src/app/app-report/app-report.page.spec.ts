import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppReportPage } from './app-report.page';

describe('AppReportPage', () => {
  let component: AppReportPage;
  let fixture: ComponentFixture<AppReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
