import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirdiStatisticsComponent } from './virdi-statistics.component';

describe('VirdiStatisticsComponent', () => {
  let component: VirdiStatisticsComponent;
  let fixture: ComponentFixture<VirdiStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VirdiStatisticsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirdiStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
