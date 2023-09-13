import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndividualCustomGraphComponent } from './individual-custom-graph.component';

describe('IndividualCustomGraphComponent', () => {
  let component: IndividualCustomGraphComponent;
  let fixture: ComponentFixture<IndividualCustomGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualCustomGraphComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualCustomGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
