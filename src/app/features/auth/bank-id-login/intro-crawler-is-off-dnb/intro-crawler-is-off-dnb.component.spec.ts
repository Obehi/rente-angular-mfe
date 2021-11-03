import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroCrawlerIsOffDnbComponent } from './intro-crawler-is-off-dnb.component';

describe('IntroCrawlerIsOffDnbComponent', () => {
  let component: IntroCrawlerIsOffDnbComponent;
  let fixture: ComponentFixture<IntroCrawlerIsOffDnbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroCrawlerIsOffDnbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroCrawlerIsOffDnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
