import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlerLoginComponent } from './bank-id-login.component';

describe('CrawlerLoginComponent', () => {
  let component: CrawlerLoginComponent;
  let fixture: ComponentFixture<CrawlerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrawlerLoginComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
