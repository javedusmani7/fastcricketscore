import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatmobileComponent } from './statmobile.component';

describe('StatmobileComponent', () => {
  let component: StatmobileComponent;
  let fixture: ComponentFixture<StatmobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatmobileComponent]
    });
    fixture = TestBed.createComponent(StatmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
