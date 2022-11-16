import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpStartComponent } from './pop-up-start.component';

describe('PopUpStartComponent', () => {
  let component: PopUpStartComponent;
  let fixture: ComponentFixture<PopUpStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
