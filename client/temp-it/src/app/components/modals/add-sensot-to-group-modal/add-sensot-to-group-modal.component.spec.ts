import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSensotToGroupModalComponent } from './add-sensot-to-group-modal.component';

describe('AddSensotToGroupModalComponent', () => {
  let component: AddSensotToGroupModalComponent;
  let fixture: ComponentFixture<AddSensotToGroupModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSensotToGroupModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSensotToGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
