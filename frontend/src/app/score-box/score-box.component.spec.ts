import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBoxComponent } from './score-box.component';

describe('ScoreBoxComponent', () => {
  let component: ScoreBoxComponent;
  let fixture: ComponentFixture<ScoreBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreBoxComponent]
    });
    fixture = TestBed.createComponent(ScoreBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
