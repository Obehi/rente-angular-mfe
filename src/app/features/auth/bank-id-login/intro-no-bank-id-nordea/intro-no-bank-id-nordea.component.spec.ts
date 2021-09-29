import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroNoBankIdNordeaComponent } from './intro-no-bank-id-nordea.component';

describe('IntroNoBankIdNordeaComponent', () => {
  let component: IntroNoBankIdNordeaComponent;
  let fixture: ComponentFixture<IntroNoBankIdNordeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroNoBankIdNordeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroNoBankIdNordeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
