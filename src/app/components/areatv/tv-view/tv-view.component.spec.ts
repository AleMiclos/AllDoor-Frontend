import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvViewComponent } from './tv-view.component';

describe('TvViewComponent', () => {
  let component: TvViewComponent;
  let fixture: ComponentFixture<TvViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
