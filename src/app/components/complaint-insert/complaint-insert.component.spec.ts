import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintInsertComponent } from './complaint-insert.component';

describe('ComplaintInsertComponent', () => {
  let component: ComplaintInsertComponent;
  let fixture: ComponentFixture<ComplaintInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintInsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
