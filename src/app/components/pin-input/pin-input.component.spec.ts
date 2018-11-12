import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinInputComponent } from './pin-input.component';

describe('PinInputComponent', () => {
  let component: PinInputComponent;
  let fixture: ComponentFixture<PinInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
