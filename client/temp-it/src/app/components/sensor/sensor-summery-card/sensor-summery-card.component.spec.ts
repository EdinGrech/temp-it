import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SensorSummeryCardComponent } from './sensor-summery-card.component';

describe('SensorSummeryCardComponent', () => {
  let component: SensorSummeryCardComponent;
  let fixture: ComponentFixture<SensorSummeryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SensorSummeryCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SensorSummeryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
