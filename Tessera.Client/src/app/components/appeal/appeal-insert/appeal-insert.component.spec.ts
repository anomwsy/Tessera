import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealInsertComponent } from './appeal-insert.component';

describe('AppealInsertComponent', () => {
  let component: AppealInsertComponent;
  let fixture: ComponentFixture<AppealInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppealInsertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppealInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
