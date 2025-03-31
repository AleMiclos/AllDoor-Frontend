import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotemDetailsComponent } from './totem.component';

describe('TotemComponent', () => {
  let component: TotemDetailsComponent;
  let fixture: ComponentFixture<TotemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
