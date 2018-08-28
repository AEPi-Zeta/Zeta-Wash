import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrothersListComponent } from './brothers-list.component';

describe('BrothersListComponent', () => {
  let component: BrothersListComponent;
  let fixture: ComponentFixture<BrothersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrothersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrothersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
