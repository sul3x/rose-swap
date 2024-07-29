import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherGardensPage } from './other-gardens.page';

describe('OtherGardensPage', () => {
  let component: OtherGardensPage;
  let fixture: ComponentFixture<OtherGardensPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherGardensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
