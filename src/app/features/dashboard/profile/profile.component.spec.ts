import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueProfileComponent } from './blue-profile.component';

describe('BlueProfileComponent', () => {
  let component: BlueProfileComponent;
  let fixture: ComponentFixture<BlueProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlueProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
