import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirdiErrorChoiceDialogComponent } from './virdi-error-choice-dialog.component';

describe('VirdiErrorChoiceDialogComponent', () => {
  let component: VirdiErrorChoiceDialogComponent;
  let fixture: ComponentFixture<VirdiErrorChoiceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirdiErrorChoiceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirdiErrorChoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
