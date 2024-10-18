import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSheduleComponent } from './child-shedule.component';

describe('ChildSheduleComponent', () => {
  let component: ChildSheduleComponent;
  let fixture: ComponentFixture<ChildSheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildSheduleComponent]
    });
    fixture = TestBed.createComponent(ChildSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
