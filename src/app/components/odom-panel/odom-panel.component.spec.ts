import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdomPanelComponent } from './odom-panel.component';

describe('OdomPanelComponent', () => {
  let component: OdomPanelComponent;
  let fixture: ComponentFixture<OdomPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdomPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdomPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
