import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TempHumSummeryGraphComponent } from './temp-hum-summery-graph.component';

describe('TempHumSummeryGraphComponent', () => {
  let component: TempHumSummeryGraphComponent;
  let fixture: ComponentFixture<TempHumSummeryGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TempHumSummeryGraphComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TempHumSummeryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
