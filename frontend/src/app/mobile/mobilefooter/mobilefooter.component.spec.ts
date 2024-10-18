import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilefooterComponent } from './mobilefooter.component';

describe('MobilefooterComponent', () => {
  let component: MobilefooterComponent;
  let fixture: ComponentFixture<MobilefooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobilefooterComponent]
    });
    fixture = TestBed.createComponent(MobilefooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
