import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNoComponent } from './header-no.component';

describe('HeaderNoComponent', () => {
  let component: HeaderNoComponent;
  let fixture: ComponentFixture<HeaderNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
