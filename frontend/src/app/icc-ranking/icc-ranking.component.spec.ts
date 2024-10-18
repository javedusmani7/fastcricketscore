import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IccRankingComponent } from './icc-ranking.component';

describe('IccRankingComponent', () => {
  let component: IccRankingComponent;
  let fixture: ComponentFixture<IccRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IccRankingComponent]
    });
    fixture = TestBed.createComponent(IccRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
