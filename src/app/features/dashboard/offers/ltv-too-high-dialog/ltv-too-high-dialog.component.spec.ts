import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LtvTooHighDialogComponent } from './ltv-too-high-dialog.component';

describe('LtvTooHighDialogComponent', () => {
  let component: LtvTooHighDialogComponent;
  let fixture: ComponentFixture<LtvTooHighDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LtvTooHighDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtvTooHighDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
