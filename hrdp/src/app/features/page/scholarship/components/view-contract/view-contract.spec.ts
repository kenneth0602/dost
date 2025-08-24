import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContract } from './view-contract';

describe('ViewContract', () => {
  let component: ViewContract;
  let fixture: ComponentFixture<ViewContract>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContract]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContract);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
