import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMachineComponent } from './select-machine.component';

describe('SelectMachineComponent', () => {
  let component: SelectMachineComponent;
  let fixture: ComponentFixture<SelectMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
