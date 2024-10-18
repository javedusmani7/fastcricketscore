import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CricketSheduleComponent } from './cricket-shedule.component';

describe('CricketSheduleComponent', () => {
  let component: CricketSheduleComponent;
  let fixture: ComponentFixture<CricketSheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CricketSheduleComponent]
    });
    fixture = TestBed.createComponent(CricketSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
