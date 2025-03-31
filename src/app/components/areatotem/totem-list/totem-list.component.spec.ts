import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotemListComponent } from './totem-list.component';

describe('TotemListComponent', () => {
  let component: TotemListComponent;
  let fixture: ComponentFixture<TotemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
