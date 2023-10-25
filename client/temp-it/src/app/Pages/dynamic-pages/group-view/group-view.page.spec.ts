import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupViewPage } from './group-view.page';

describe('GroupViewPage', () => {
  let component: GroupViewPage;
  let fixture: ComponentFixture<GroupViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GroupViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
