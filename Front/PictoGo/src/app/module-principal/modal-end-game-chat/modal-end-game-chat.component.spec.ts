import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEndGameChatComponent } from './modal-end-game-chat.component';

describe('ModalEndGameChatComponent', () => {
  let component: ModalEndGameChatComponent;
  let fixture: ComponentFixture<ModalEndGameChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEndGameChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEndGameChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
