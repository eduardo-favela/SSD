import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerreportesComponent } from './verreportes.component';

describe('VerreportesComponent', () => {
  let component: VerreportesComponent;
  let fixture: ComponentFixture<VerreportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerreportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerreportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
