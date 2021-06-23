import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingHelperComponent } from './mapping-helper.component';

describe('MappingHelperComponent', () => {
  let component: MappingHelperComponent;
  let fixture: ComponentFixture<MappingHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
