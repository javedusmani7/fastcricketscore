import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCenterComponent } from './match-center.component';

describe('MatchCenterComponent', () => {
  let component: MatchCenterComponent;
  let fixture: ComponentFixture<MatchCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchCenterComponent]
    });
    fixture = TestBed.createComponent(MatchCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
