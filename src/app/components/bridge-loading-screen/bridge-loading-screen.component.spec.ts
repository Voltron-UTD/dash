import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeLoadingScreenComponent } from './bridge-loading-screen.component';

describe('BridgeLoadingScreenComponent', () => {
  let component: BridgeLoadingScreenComponent;
  let fixture: ComponentFixture<BridgeLoadingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeLoadingScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeLoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
