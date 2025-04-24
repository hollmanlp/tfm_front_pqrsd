import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsltpqrsdComponent } from './csltpqrsd.component';

describe('CsltpqrsdComponent', () => {
  let component: CsltpqrsdComponent;
  let fixture: ComponentFixture<CsltpqrsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsltpqrsdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsltpqrsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
