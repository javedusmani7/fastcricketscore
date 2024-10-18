import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoComponent } from './go.component';

describe('GoComponent', () => {
  let component: GoComponent;
  let fixture: ComponentFixture<GoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoComponent]
    });
    fixture = TestBed.createComponent(GoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
