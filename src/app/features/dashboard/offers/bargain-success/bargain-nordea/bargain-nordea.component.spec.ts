import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BargainNordeaComponent } from './bargain-nordea.component';

describe('BargainNordeaComponent', () => {
  let component: BargainNordeaComponent;
  let fixture: ComponentFixture<BargainNordeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BargainNordeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BargainNordeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
