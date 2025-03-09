import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingviewTickerComponent } from './tradingview-ticker.component';

describe('TradingviewTickerComponent', () => {
  let component: TradingviewTickerComponent;
  let fixture: ComponentFixture<TradingviewTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingviewTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingviewTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
