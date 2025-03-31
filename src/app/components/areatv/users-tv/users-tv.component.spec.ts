import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTvComponent } from './users-tv.component';

describe('UsersTvComponent', () => {
  let component: UsersTvComponent;
  let fixture: ComponentFixture<UsersTvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
