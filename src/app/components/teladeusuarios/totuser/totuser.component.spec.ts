import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotuserComponent } from './totuser.component';

describe('TotuserComponent', () => {
  let component: TotuserComponent;
  let fixture: ComponentFixture<TotuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
