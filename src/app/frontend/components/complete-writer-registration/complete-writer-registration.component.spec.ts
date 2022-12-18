import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteWriterRegistrationComponent } from './complete-writer-registration.component';

describe('CompleteWriterRegistrationComponent', () => {
  let component: CompleteWriterRegistrationComponent;
  let fixture: ComponentFixture<CompleteWriterRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteWriterRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteWriterRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
