import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponentComponent } from './signin-component.component';

describe('SigninComponentComponent', () => {
  let component: SigninComponentComponent;
  let fixture: ComponentFixture<SigninComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
