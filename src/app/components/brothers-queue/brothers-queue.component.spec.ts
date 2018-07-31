import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrothersQueueComponent } from './brothers-queue.component';

describe('BrothersQueueComponent', () => {
  let component: BrothersQueueComponent;
  let fixture: ComponentFixture<BrothersQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrothersQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrothersQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
