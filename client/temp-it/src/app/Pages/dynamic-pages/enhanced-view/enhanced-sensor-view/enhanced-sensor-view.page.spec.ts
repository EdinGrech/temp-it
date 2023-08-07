import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnhancedSensorViewPage } from './enhanced-sensor-view.page';

describe('EnhancedSensorViewPage', () => {
  let component: EnhancedSensorViewPage;
  let fixture: ComponentFixture<EnhancedSensorViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnhancedSensorViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
