import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListSvComponent } from './offers-list-sv.component';

describe('OffersListSvComponent', () => {
  let component: OffersListSvComponent;
  let fixture: ComponentFixture<OffersListSvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersListSvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersListSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
