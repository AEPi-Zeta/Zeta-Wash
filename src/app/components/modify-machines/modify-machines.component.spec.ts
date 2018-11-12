import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMachinesComponent } from './modify-machines.component';

describe('ModifyMachinesComponent', () => {
  let component: ModifyMachinesComponent;
  let fixture: ComponentFixture<ModifyMachinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyMachinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
