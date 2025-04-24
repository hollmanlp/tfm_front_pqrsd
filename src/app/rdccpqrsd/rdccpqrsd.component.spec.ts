import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdccpqrsdComponent } from './rdccpqrsd.component';

describe('RdccpqrsdComponent', () => {
  let component: RdccpqrsdComponent;
  let fixture: ComponentFixture<RdccpqrsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdccpqrsdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdccpqrsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
