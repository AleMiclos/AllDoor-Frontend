import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvsInfoComponent } from './tvs-info.component';

describe('TvsInfoComponent', () => {
  let component: TvsInfoComponent;
  let fixture: ComponentFixture<TvsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
