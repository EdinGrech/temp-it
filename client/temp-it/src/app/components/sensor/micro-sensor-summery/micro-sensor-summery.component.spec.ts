import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicroSensorSummeryComponent } from './micro-sensor-summery.component';

describe('MicroSensorSummeryComponent', () => {
  let component: MicroSensorSummeryComponent;
  let fixture: ComponentFixture<MicroSensorSummeryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MicroSensorSummeryComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MicroSensorSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
