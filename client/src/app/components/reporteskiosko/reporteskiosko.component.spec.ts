import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteskioskoComponent } from './reporteskiosko.component';

describe('ReporteskioskoComponent', () => {
  let component: ReporteskioskoComponent;
  let fixture: ComponentFixture<ReporteskioskoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteskioskoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteskioskoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
