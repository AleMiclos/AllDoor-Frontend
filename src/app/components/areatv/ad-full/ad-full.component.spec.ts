import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdFullComponent } from './ad-full.component';

describe('AdFullComponent', () => {
  let component: AdFullComponent;
  let fixture: ComponentFixture<AdFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
