import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvuserComponent } from './tvuser.component';

describe('TvuserComponent', () => {
  let component: TvuserComponent;
  let fixture: ComponentFixture<TvuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
