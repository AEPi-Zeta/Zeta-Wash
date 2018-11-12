import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMachineComponent } from './modify-machine.component';

describe('ModifyMachineComponent', () => {
  let component: ModifyMachineComponent;
  let fixture: ComponentFixture<ModifyMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
