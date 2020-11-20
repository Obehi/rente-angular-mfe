import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksGuideComponent } from './banks-guide.component';

describe('BanksGuideComponent', () => {
  let component: BanksGuideComponent;
  let fixture: ComponentFixture<BanksGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BanksGuideComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
