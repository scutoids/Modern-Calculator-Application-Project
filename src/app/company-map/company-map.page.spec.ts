import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyMapPage } from './company-map.page';

describe('CompanyMapPage', () => {
  let component: CompanyMapPage;
  let fixture: ComponentFixture<CompanyMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
