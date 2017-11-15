import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GremlinsComponent } from './gremlins.component';
import { FormsModule } from '@angular/forms';

describe('GremlinsComponent', () => {
  let component: GremlinsComponent;
  let fixture: ComponentFixture<GremlinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GremlinsComponent ],
      imports: [
        FormsModule
      ]
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
