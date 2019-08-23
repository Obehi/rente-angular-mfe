import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sparebank1SubComponent } from './sparebank1-sub.component';

describe('Sparebank1SubComponent', () => {
  let component: Sparebank1SubComponent;
  let fixture: ComponentFixture<Sparebank1SubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sparebank1SubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sparebank1SubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
