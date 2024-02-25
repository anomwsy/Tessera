import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSolutionComponent } from './ticket-solution.component';

describe('TicketSolutionComponent', () => {
  let component: TicketSolutionComponent;
  let fixture: ComponentFixture<TicketSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketSolutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
