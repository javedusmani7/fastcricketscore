import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllscorsdataComponent } from './allscorsdata.component';

describe('AllscorsdataComponent', () => {
  let component: AllscorsdataComponent;
  let fixture: ComponentFixture<AllscorsdataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllscorsdataComponent]
    });
    fixture = TestBed.createComponent(AllscorsdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
