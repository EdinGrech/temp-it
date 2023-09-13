import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollectiveSensorSummeryComponent } from './collective-sensor-summery.component';

describe('CollectiveSensorSummeryComponent', () => {
  let component: CollectiveSensorSummeryComponent;
  let fixture: ComponentFixture<CollectiveSensorSummeryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollectiveSensorSummeryComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectiveSensorSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
