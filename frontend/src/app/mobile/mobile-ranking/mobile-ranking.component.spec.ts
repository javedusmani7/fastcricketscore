import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRankingComponent } from './mobile-ranking.component';

describe('MobileRankingComponent', () => {
  let component: MobileRankingComponent;
  let fixture: ComponentFixture<MobileRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileRankingComponent]
    });
    fixture = TestBed.createComponent(MobileRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
