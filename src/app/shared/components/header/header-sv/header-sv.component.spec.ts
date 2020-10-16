import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSvComponent } from './header-sv.component';

describe('HeaderSvComponent', () => {
  let component: HeaderSvComponent;
  let fixture: ComponentFixture<HeaderSvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
