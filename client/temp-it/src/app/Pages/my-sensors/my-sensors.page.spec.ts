import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { MySensorsPage } from './my-sensors.page';

describe('Tab2Page', () => {
  let component: MySensorsPage;
  let fixture: ComponentFixture<MySensorsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySensorsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MySensorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
