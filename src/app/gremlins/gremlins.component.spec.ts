import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GremlinsComponent } from './gremlins.component';

describe('GremlinsComponent', () => {
  let component: GremlinsComponent;
  let fixture: ComponentFixture<GremlinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GremlinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GremlinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
